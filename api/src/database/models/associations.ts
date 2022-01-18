import { Card, Component, Page, PageComponent, Program } from "./internal";

export const programBelongsToPage = Program.belongsTo(Page, {
  as: "page",
  foreignKey: "id",
  onDelete: "CASCADE",
});

export const pageHasOneProgram = Page.hasOne(Program, {
  as: "program",
  foreignKey: "id",
  sourceKey: "id",
  onDelete: "CASCADE",
});

export const pageHasManyPageComponents = Page.hasMany(PageComponent, {
  as: "pageComponents",
  foreignKey: "pageId",
  onDelete: "CASCADE",
  sourceKey: "id",
});

export const componentHasManyCards = Component.hasMany(Card, {
  as: "cards",
  foreignKey: "componentId",
  onDelete: "CASCADE",
  sourceKey: "id",
});

export const pageComponentHasOneComponent = PageComponent.hasOne(Component, {
  as: "component",
  foreignKey: "id",
  sourceKey: "componentId",
  onDelete: "CASCADE",
});

export const pageComponentHasOnePage = PageComponent.hasOne(Page, {
  as: "page",
  foreignKey: "id",
  sourceKey: "pageId",
  onDelete: "CASCADE",
});

export const pageComponentBelongsToPage = PageComponent.belongsTo(Page, {
  as: "pageComponents",
  foreignKey: "pageId",
  targetKey: "id",
});
