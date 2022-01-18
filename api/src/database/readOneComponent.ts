import { ComponentModel } from "api-shared";
import { ReadOneByIdModel } from "../core";
import { componentMapper } from "./componentMapper";
import { readOneByIdFactory } from "./factories";
import { Component } from "./models";

export const readOneComponent = readOneByIdFactory<
  ComponentModel,
  ReadOneByIdModel<ComponentModel>,
  Component
>({
  name: "readOneComponent",
  innerReadByOneById: async (model) => {
    const { id } = model;
    const result = await Component.findOne({ where: { id }, include: "cards" });
    return result;
  },
  modelMapper: componentMapper.mapModel,
});
