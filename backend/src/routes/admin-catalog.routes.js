
const router = require("express").Router();

const {
  requireAdmin,
  requireSuperAdmin
} = require("../middleware/require-admin");

const {
  config,
  cleanBody,
  checkReferences,
  handleError,
  fail,
  goodId
} = require("../utils/admin-catalog-utils");

const {
  ProductGroup,
  Product,
  ProductModel
} = require("../models/catalog.models");

/* ==========================================
   ADMIN AUTHENTICATION
========================================== */

// All catalogue management endpoints require
// an authenticated Super Admin.

router.use(requireAdmin, requireSuperAdmin);

/* ==========================================
   ASYNC ERROR WRAPPER
========================================== */

const wrap = (fn) => async (req, res, next) => {
  try {
    await fn(req, res);
  } catch (error) {
    handleError(error, res, next);
  }
};

/* ==========================================
   RESOURCE CONFIGURATION
========================================== */

function resourceFrom(req) {
  const resource = req.params.resource;

  if (
    !Object.prototype.hasOwnProperty.call(
      config,
      resource
    )
  ) {
    throw fail(
      404,
      "Unknown catalogue resource."
    );
  }

  return {
    resource,
    ...config[resource]
  };
}

/* ==========================================
   GENERATE SLUG AUTOMATICALLY
========================================== */

function generateSlug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/* ==========================================
   AUTOMATIC SORT ORDER
========================================== */

async function getNextSortOrder(
  resource,
  Model,
  data
) {
  // Product Models do not have a top-level
  // sortOrder field in the current schema.

  if (resource === "models") {
    return undefined;
  }

  if (!("sortOrder" in Model.schema.paths)) {
    return undefined;
  }

  const scope = {};

  // Product Groups are ordered within Brands.
  if (resource === "groups") {
    scope.brandId = data.brandId;
  }

  // Products are ordered within Product Groups.
  if (resource === "products") {
    scope.groupId = data.groupId;
  }

  const lastRecord = await Model
    .findOne(scope)
    .sort({
      sortOrder: -1,
      _id: -1
    })
    .select("sortOrder")
    .lean();

  const previousOrder =
    Number(lastRecord?.sortOrder) || 0;

  // Use increments of 10 for future flexibility.
  return Math.max(0, previousOrder) + 10;
}

/* ==========================================
   GET ALL CATALOGUE RECORDS
========================================== */

// GET /api/v1/admin/catalog/:resource

router.get(
  "/:resource",
  wrap(async (req, res) => {
    const {
      Model
    } = resourceFrom(req);

    const page = Math.max(
      1,
      Math.min(
        100000,
        parseInt(req.query.page, 10) || 1
      )
    );

    const limit = Math.max(
      1,
      Math.min(
        50,
        parseInt(req.query.limit, 10) || 12
      )
    );

    const filter = {};

    /* STATUS FILTER */

    if (req.query.status) {
      const validStatuses = [
        "draft",
        "published",
        "inactive"
      ];

      if (
        !validStatuses.includes(
          req.query.status
        )
      ) {
        throw fail(
          400,
          "Invalid status filter."
        );
      }

      filter.status = req.query.status;
    }

    /* PARENT FILTERS */

    for (const key of [
      "brandId",
      "groupId",
      "productId"
    ]) {
      if (
        key in Model.schema.paths &&
        req.query[key]
      ) {
        if (!goodId(req.query[key])) {
          throw fail(
            400,
            `Invalid ${key}.`
          );
        }

        filter[key] = req.query[key];
      }
    }

    /* SORT CONFIGURATION */

    const sortConfig =
      "sortOrder" in Model.schema.paths
        ? {
            sortOrder: 1,
            createdAt: 1,
            _id: 1
          }
        : {
            createdAt: -1,
            _id: -1
          };

    /* FETCH RECORDS */

    const [data, total] = await Promise.all([
      Model.find(filter)
        .sort(sortConfig)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      Model.countDocuments(filter)
    ]);

    return res.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  })
);

/* ==========================================
   GET SINGLE RECORD
========================================== */

// GET /api/v1/admin/catalog/:resource/:id

router.get(
  "/:resource/:id",
  wrap(async (req, res) => {
    const {
      Model
    } = resourceFrom(req);

    if (!goodId(req.params.id)) {
      throw fail(
        400,
        "Valid record ID required."
      );
    }

    const data = await Model
      .findById(req.params.id)
      .lean();

    if (!data) {
      throw fail(
        404,
        "Record not found."
      );
    }

    return res.json({
      success: true,
      data
    });
  })
);

/* ==========================================
   CREATE NEW CATALOGUE RECORD
========================================== */

// POST /api/v1/admin/catalog/:resource

router.post(
  "/:resource",
  wrap(async (req, res) => {
    const {
      resource,
      Model,
      ...item
    } = resourceFrom(req);

    // Copy the incoming data without
    // changing the original request object.
    const input = {
      ...req.body
    };

    /* AUTOMATIC SLUG */

    // Generate a slug when the Admin form does
    // not supply one. Existing valid slugs
    // provided by older clients are preserved.

    if (
      !input.slug ||
      !String(input.slug).trim()
    ) {
      const sourceName =
        input.name ||
        input.modelName ||
        "";

      input.slug = generateSlug(
        sourceName
      );
    }

    if (!input.slug) {
      throw fail(
        400,
        "Unable to generate a slug. Please enter a valid name."
      );
    }

    /* VALIDATE RECORD */

    const data = cleanBody(
      input,
      item,
      true
    );

    /* CHECK RELATIONSHIPS */

    await checkReferences(
      resource,
      data
    );

    /* AUTOMATIC SORT ORDER */

    if (
      resource !== "models" &&
      "sortOrder" in Model.schema.paths &&
      data.sortOrder === undefined
    ) {
      data.sortOrder =
        await getNextSortOrder(
          resource,
          Model,
          data
        );
    }

    /* CREATE RECORD */


const created = await Model.create(data);

return res.status(201).json({
  success: true,
  message: `${Model.modelName} created successfully.`,
  data: created
});

  })
);

/* ==========================================
   UPDATE CATALOGUE RECORD
========================================== */

// PATCH /api/v1/admin/catalog/:resource/:id

router.patch(
  "/:resource/:id",
  wrap(async (req, res) => {
    const {
      resource,
      Model,
      ...item
    } = resourceFrom(req);

    /* VALIDATE ID */

    if (!goodId(req.params.id)) {
      throw fail(
        400,
        "Valid record ID required."
      );
    }

    /* GET EXISTING RECORD */

    const existing = await Model.findById(
      req.params.id
    );

    if (!existing) {
      throw fail(
        404,
        "Record not found."
      );
    }

    /* VALIDATE UPDATES */

    const updates = cleanBody(
      req.body,
      item,
      false
    );

    if (
      Object.keys(updates).length === 0
    ) {
      throw fail(
        400,
        "Provide at least one field to update."
      );
    }

    /* PREVENT ACCIDENTAL REPARENTING */

    // Moving a Product from one Group to
    // another is not supported by this API.

    for (const key of [
      "brandId",
      "groupId",
      "productId"
    ]) {
      if (
        key in updates &&
        String(updates[key]) !==
          String(existing[key])
      ) {
        throw fail(
          400,
          `Changing ${key} is not supported. Create a new record in the correct parent.`
        );
      }
    }

    /* PRESERVE ORIGINAL SLUG */

    // If slug is not included in the update,
    // its existing value remains unchanged.
    // This protects established website links.

    /* CHECK UPDATED RELATIONSHIPS */

    const merged = {
      ...existing.toObject(),
      ...updates
    };

    await checkReferences(
      resource,
      merged
    );

    /* MODEL INDUSTRY/APPLICATION INHERITANCE */

    const clearIndustry =
      req.body.industryOverrideIds === null;

    const clearApplication =
      req.body.applicationOverrideIds === null;

    if (
      updates.industryOverrideIds === null
    ) {
      delete updates.industryOverrideIds;
    }

    if (
      updates.applicationOverrideIds === null
    ) {
      delete updates.applicationOverrideIds;
    }

    /* APPLY UPDATES */

    for (
      const [key, value]
      of Object.entries(updates)
    ) {
      existing.set(
        key,
        value
      );
    }

    if (clearIndustry) {
      existing.set(
        "industryOverrideIds",
        undefined
      );
    }

    if (clearApplication) {
      existing.set(
        "applicationOverrideIds",
        undefined
      );
    }

    /* SAVE RECORD */

    await existing.save();

    return res.json({
      success: true,
      message:
        "Record updated successfully.",
      data: existing
    });
  })
);

/* ==========================================
   SAFE PERMANENT DELETE
========================================== */

// DELETE /api/v1/admin/catalog/:resource/:id

router.delete(
  "/:resource/:id",
  wrap(async (req, res) => {
    const {
      resource,
      Model
    } = resourceFrom(req);

    /* VALIDATE ID */

    if (!goodId(req.params.id)) {
      throw fail(
        400,
        "Valid record ID required."
      );
    }

    const id = req.params.id;

    /* GET EXISTING RECORD */

    const existing = await Model.findById(id);

    if (!existing) {
      throw fail(
        404,
        "Record not found."
      );
    }

    /* ======================================
       BRAND DELETE VALIDATION
    ====================================== */

    if (resource === "brands") {
      const hasGroups =
        await ProductGroup.exists({
          brandId: id
        });

      const hasProducts =
        await Product.exists({
          brandId: id
        });

      if (hasGroups || hasProducts) {
        throw fail(
          409,
          "Cannot delete this Brand because it contains Product Groups or Products. Delete its linked records first."
        );
      }
    }

    /* ======================================
       GROUP DELETE VALIDATION
    ====================================== */

    if (resource === "groups") {
      const hasProducts =
        await Product.exists({
          groupId: id
        });

      if (hasProducts) {
        throw fail(
          409,
          "Cannot delete this Product Group because it contains Products. Delete those Products first."
        );
      }
    }

    /* ======================================
       PRODUCT DELETE VALIDATION
    ====================================== */

    if (resource === "products") {
      const hasModels =
        await ProductModel.exists({
          productId: id
        });

      if (hasModels) {
        throw fail(
          409,
          "Cannot delete this Product because it contains Product Models. Delete those Models first."
        );
      }
    }

    /* ======================================
       INDUSTRY DELETE VALIDATION
    ====================================== */

    if (resource === "industries") {
      const usedByProduct =
        await Product.exists({
          industryIds: id
        });

      const usedByModel =
        await ProductModel.exists({
          industryOverrideIds: id
        });

      if (
        usedByProduct ||
        usedByModel
      ) {
        throw fail(
          409,
          "Cannot delete this Industry because it is assigned to Products or Product Models. Remove the assignments first."
        );
      }
    }

    /* ======================================
       APPLICATION DELETE VALIDATION
    ====================================== */

    if (resource === "applications") {
      const usedByProduct =
        await Product.exists({
          applicationIds: id
        });

      const usedByModel =
        await ProductModel.exists({
          applicationOverrideIds: id
        });

      if (
        usedByProduct ||
        usedByModel
      ) {
        throw fail(
          409,
          "Cannot delete this Application because it is assigned to Products or Product Models. Remove the assignments first."
        );
      }
    }

    /* ======================================
       PERMANENTLY DELETE RECORD
    ====================================== */

    const result = await Model.deleteOne({
      _id: id
    });

    if (result.deletedCount !== 1) {
      throw fail(
        404,
        "Record was not found during deletion."
      );
    }

    return res.json({
      success: true,
      message:
        "Record permanently deleted successfully.",
      data: {
        id,
        resource
      }
    });
  })
);

/* ==========================================
   EXPORT ADMIN ROUTER
========================================== */

module.exports = router;
