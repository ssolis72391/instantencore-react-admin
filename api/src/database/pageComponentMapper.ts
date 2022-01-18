import { PageComponentModel } from "api-shared";
import { componentMapper } from "./componentMapper";
import { ModelMapper } from "./core";
import { PageComponent } from "./models";

export const pageComponentMapper: ModelMapper<
  PageComponentModel,
  PageComponent
> = {
  mapModel({
    componentId,
    datesOverrideMode,
    id,
    orderIndex,
    pageId,
    component,
  }) {
    return {
      componentId,
      datesOverrideMode,
      id,
      orderIndex,
      pageId,
      component: component ? componentMapper.mapModel(component) : undefined,
    };
  },
  mapInnerModel({
    componentId,
    datesOverrideMode,
    id,
    orderIndex,
    pageId,
    component,
  }) {
    return {
      componentId,
      datesOverrideMode,
      id,
      orderIndex,
      pageId,
      component: component
        ? componentMapper.mapInnerModel(component)
        : undefined,
    };
  },
};
