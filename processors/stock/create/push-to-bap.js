"use strict";
const productService = require("./../../../services/products");
const bapProvider = require("./../../../providers/bap");

exports.process = async (data, context) => {
  let product = await productService.getById(data.id, context);
  //    return bapProvider.createEntity({
  //         entityId: product.id,
  //         entityName: product.name,
  //         entityCode: product.code,
  //         entitySubBrand: product.subBrand,
  //         entityPrice: product.price,
  //         entityDescription: product.description,
  //         entityPic: product.pic,
  //         entityDiscount: product.discount,
  //         entityTaxes: product.taxes,
  //         entityOrganization: product.organization,
  //         entityCategory: product.category,
  //         entityTenant: product.tenant,
  //         entityManufacturer: product.manufacturer
  //     }, context)
};
