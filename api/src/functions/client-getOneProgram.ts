"use strict";
import { ComponentCardHelper } from "api-shared";
import { APIGatewayProxyEvent } from "aws-lambda";
import { Component, Page, PageComponent, Program } from "../database/models";
import { Card } from "../database/models/Card";

class PageDataWithNested {
  page: Page;
  components: Component[];
  cards: Card[];
}

class ActionClient {
  type: string;
  value: any;
}

class CardClient {
  id: number;
  image: string;
  title: string;
  description: string;
  action: ActionClient;
}

class ComponentClient {
  id: number;
  cardType: string;
  style: string;
  title: string;
  subtitle: string;
  cardImageSize: string;
  cardImagePosition: string;
  maxCards: number;
  viewAllText: string;
  cards: CardClient[];
}

class HeaderClient {
  pretitle: string;
  title: string;
  subtitle: string;
  image: string;
  contentPosition: string;
  imageSize: string;
}

class PageClient {
  id: number;
  title: string;
  pageType: string;
  header: HeaderClient;
  components: ComponentClient[];
}
class ProgramClient {
  id: number;
  title?: string;
  startDate?: string;
  endDate?: string;
  pages?: PageClient[];
}

export const handler = async (event: APIGatewayProxyEvent) => {
  const id = +event.pathParameters.id;
  // get data from DB
  const data = await getData(id);
  const rootPage = data.pages.find((page) => page.page.id === id);
  // map data to the client model
  const programClient: ProgramClient = {
    id: data.program.id,
    endDate: data.program.localEndDate,
    startDate: data.program.localStartDate,
    title: rootPage.page.internalName,
    pages: [],
  };
  data.pages.forEach((t) => {
    const page = t.page;
    const pageClient: PageClient = {
      id: page.id,
      title: page.internalName,
      pageType: page.id === rootPage.page.id ? "root" : "nested",
      header: {
        pretitle: page.headerPreTitle,
        title: page.headerTitle,
        subtitle: page.headerSubTitle,
        image: page.headerImageUrl,
        contentPosition: page.headerTextPosition,
        imageSize: page.headerImageSize,
      },
      components: [],
    };
    t.components.forEach((component) => {
      const componentClient: ComponentClient = {
        id: component.id,
        cardType: ComponentCardHelper.getClientCardType(component.type),
        style: component.style,
        title: component.title,
        subtitle: component.subTitle,
        cardImageSize: component.cardImageSize,
        cardImagePosition: component.cardImagePosition,
        maxCards: component.maxCards,
        viewAllText: component.viewAllText,
        cards: [],
      };
      t.cards.forEach((card) => {
        if (card.componentId == component.id) {
          const cardClient: CardClient = {
            id: card.id,
            image: card.imageUrl,
            title: card.title,
            description: card.description,
            action: null,
          };
          if (card.action != "none") {
            cardClient.action = {
              type: card.action, //TODO: verify these match
              value: card.action == "page" ? card.pageId : card.url,
            };
          }
          componentClient.cards.push(cardClient);
        }
      });
      pageClient.components.push(componentClient);
    });
    programClient.pages.push(pageClient);
  });

  const response = {
    statusCode: 200,
    body: JSON.stringify(programClient),
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
    },
  };
  return response;
};

const getData = async (id: number) => {
  const program = await Program.findOne({
    where: {
      id: id,
    },
  });
  const pages: PageDataWithNested[] = [];
  const page = await getPageDataWithNested(id);
  pages.push(page);
  await getSubPage(pages, page);

  const data = {
    program: program,
    pages: pages,
  };
  return data;
};

const getSubPage = async (pages: any[], page: PageDataWithNested) => {
  for (let i = 0; i < page.cards.length; i++) {
    const card = page.cards[i];
    if (card.pageId) {
      const pageExists = pages.find((page) => page.id === card.pageId) != null;
      if (!pageExists) {
        console.log("page exists: false");
        const subPage = await getPageDataWithNested(card.pageId);
        pages.push(subPage);
        console.log("subPage", subPage);
        await getSubPage(pages, subPage);
      } else {
      }
    }
  }
};

async function getPageDataWithNested(pageId: number) {
  // TODO: use proper associations with sequelize to retrieve data. This is hacky, but does retrieve the right data.

  // Get page
  const page = await Page.findOne({
    where: {
      id: pageId,
    },
  });

  // Get components for the page
  const pageComponents = await PageComponent.findAll({
    where: {
      pageId: pageId,
    },
    order: [["orderIndex", "ASC"]],
  });
  const componentIds = pageComponents.map(
    (pageComponent) => pageComponent.componentId
  );
  const components = await Component.findAll({
    where: {
      id: componentIds,
      deletedAt: null,
      visible: 1,
    },
  });
  let componentsOrdered = pageComponents.map((m) => {
    return components.find((c) => c.id == m.componentId);
  });
  // some may be null since we are filtering out if deletedAt is not null or visible is not 1.
  componentsOrdered = componentsOrdered.filter((m) => m != null);

  // Get cards for the components
  const cards = await Card.findAll({
    where: {
      componentId: componentIds,
      visible: 1,
    },
    order: [
      ["componentId", "ASC"],
      ["orderIndex", "ASC"],
    ],
  });

  const data: PageDataWithNested = {
    page: page,
    components: componentsOrdered,
    cards: cards,
  };
  return data;
}
