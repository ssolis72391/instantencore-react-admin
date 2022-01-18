/**
 * This script is used to ./program-test.json. The purpose is to have an easy way to generate mock data that allows us to visualize all the possible options.
 *
 * Options used:
 *   - Card Type (mapped Component Types):
 *     - standard (Text Card, Thumbnail Card, Image Card, Verical Card List)
 *     - horizontal (Horizontal Card List)
 *     - simple (Text List)
 *     - content (HTML)
 *   - Component Style:
 *     - default
 *     - highlight
 *   - Image Size:
 *     - cover
 *     - contain
 *     - full
 *   - Image Positons:
 *     - top
 *     - bottom
 *     - left
 *     - right
 *   - Action
 *     - Has action
 *     - Without action
 *   - Text length
 *
 * Using a script to generate to mock data is preferred over creating the mock data manually because:
 *   - If the json format changes we can just update a few lines in the script.
 *   - It's quick to iterate different options using arrays.
 *
 * As we find new test cases we should add them to this file so that they are in the mock data.
 *
 * RUNNING THE SCRIPT
 *
 * Run the following commands to update `program-test.json`.
 *
 * ```
 * cd client-core
 * node ./src/mocks/mock-creator.js
 * ```
 *
 */

const fs = require("fs");

let _pages = [];
let _pageIndex = 1;
let _componentIndex = 1;
let _cardIndex = 1;
let _rootPage = null;
const IMAGE_SQUARE =
  "https://s3.amazonaws.com/data.instantencore.com/image/1074084/beethoven.jpg";
const IMAGE_WIDE =
  "https://s3.amazonaws.com/data.instantencore.com/image/1074094/p08lbj4t.jpg";
const HEADER_CONTENT_POSITIONS = ["above", "below", "overlay"];
const IMAGE_SIZES = ["cover", "contain", "full"];
const IMAGE_SIZES_NO_FULL = ["cover", "contain"];
const IMAGE_POSITIONS_LEFT_RIGHT = ["left", "right"];
const IMAGE_POSITIONS_TOP_BOTTOM = ["top", "bottom"];
const TEXT_SHORT = "This is short text";
const TEXT_MEDIUM =
  "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.";
const TEXT_SHORT_MEDIUM = [TEXT_SHORT, TEXT_MEDIUM];
const TEXT_LONG = [
  "<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.</p><p>Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.</p>",
];
const COMPONENT_STYLES = ["default", "spotlight"];
const ACTIONS = [
  {
    type: "link",
    value: "https://google.com",
  },
  null,
];
const HEADER_CONTENT_CONFIGURATIONS = [
  {
    pretitle: null,
    title: null,
    subtitle: null,
  },
  {
    pretitle: "pretitle only",
    title: null,
    subtitle: null,
  },
  {
    pretitle: null,
    title: "title only",
    subtitle: null,
  },
  {
    pretitle: null,
    title: null,
    subtitle: "subtitle only",
  },
  {
    pretitle: "pretitle",
    title: "title",
    subtitle: null,
  },
  {
    pretitle: "pretitle",
    title: null,
    subtitle: "subtitle",
  },
  {
    pretitle: null,
    title: "title",
    subtitle: "subtitle",
  },
  {
    pretitle: "pretitle",
    title: "title",
    subtitle: "subtitle",
  },
];

const COMPONENT_TITLE_CONFIGURATIONS = [
  {
    title: "Title",
    subtitle: "Subtitle",
  },
  {
    title: "Title",
    subtitle: null,
  },
  {
    title: null,
    subtitle: null,
  },
];

const CARD_CONTENT_CONFIGURATIONS = [
  {
    title: "Title",
    description: "Subtitle",
  },
  {
    title: "Title",
    description: null,
  },
  {
    title: null,
    description: null,
  },
];

/** Header Content Position and Image Size examples. */
const createTestsHeadersContentPositionAndImageSize = () => {
  const component = createComponent({
    cardType: "standard",
    title: "Headers",
    subtitle: "Content Position and Image Size",
  });
  _rootPage.components.push(component);

  HEADER_CONTENT_POSITIONS.forEach(function (headerContentPosition) {
    IMAGE_SIZES.forEach(function (imageSize) {
      const header = createHeader({
        title: `Content Position: ${headerContentPosition}, Image Size: ${imageSize}`,
        contentPosition: headerContentPosition,
        imageSize: imageSize,
      });
      const page = createPage({
        title: "Headers",
        header: header,
      });
      component.cards.push(createTextCard(header.title, page.id));
    });
  });
  component.maxCards = component.cards.length;
};

/** pretitle, title and subtitle examples */
const createTestsHeadersContent = () => {
  const component = createComponent({
    cardType: "standard",
    title: "Headers",
    subtitle: "pretitle, title, subtitle examples",
  });
  _rootPage.components.push(component);

  HEADER_CONTENT_CONFIGURATIONS.forEach(function (contentConfig) {
    const name = `pretitle: ${existsYesNo(
      contentConfig.pretitle
    )}, title: ${existsYesNo(contentConfig.title)}, subtitle: ${existsYesNo(
      contentConfig.subtitle
    )}`;
    const header = createHeader({
      pretitle: contentConfig.pretitle,
      title: contentConfig.title,
      subtitle: contentConfig.subtitle,
    });
    const page = createPage({
      title: name,
      header: header,
    });
    component.cards.push(createTextCard(name, page.id));
  });
  component.maxCards = component.cards.length;
};

/** Component title and subtitle examples. */
const createTestsComponentTitles = () => {
  var page = createPage({
    title: "Component Titles",
  });
  page.header.subtitle =
    "Verify the Component title and subtitle combinations are correct below.";

  COMPONENT_TITLE_CONFIGURATIONS.forEach(function (titleConfig) {
    const exampleComponent = createComponent({
      title: titleConfig.title,
      subtitle: titleConfig.subtitle,
    });
    exampleComponent.cards.push(
      createTextCard(
        `Title: ${existsYesNo(titleConfig.title)}, Subtitle: ${existsYesNo(
          titleConfig.subtitle
        )}`
      )
    );
    page.components.push(exampleComponent);
  });

  const card = createTextCard("Examples", page.id);
  const component = createComponent({
    title: "Component Titles",
    cards: [card],
  });
  _rootPage.components.push(component);
};

/** Card Component Types examples. */
const createTestsCardComponents = () => {
  const component = createComponent({
    title: "Cards Components",
  });
  _rootPage.components.push(component);

  // TEXT CARD

  const textCardsPage = createPage({
    title: "Text Cards",
  });

  COMPONENT_STYLES.forEach(function (style) {
    TEXT_SHORT_MEDIUM.forEach(function (text) {
      ACTIONS.forEach(function (action) {
        const pageComponent = createComponent({
          style: style,
          title: `Text length: ${
            text.length
          }, Style: ${style}, Action: ${existsYesNo(action)}`,
        });
        const card = createTextCard(text);
        card.action = action;
        pageComponent.cards.push(card);
        textCardsPage.components.push(pageComponent);
      });
    });
  });

  component.cards.push(createTextCard(textCardsPage.title, textCardsPage.id));

  // THUMBNAIL CARD: Action, Image Position, Image Size, Style

  const thumbnailOptionsPage = createPage({
    title: "Thumbnail Card",
    header: createHeader({
      title: "Thumbnail Card",
      subtitle: "Action, Image Position, Image Size, Style",
    }),
  });

  COMPONENT_STYLES.forEach(function (style) {
    IMAGE_SIZES_NO_FULL.forEach(function (imageSize) {
      IMAGE_POSITIONS_LEFT_RIGHT.forEach(function (imagePosition) {
        ACTIONS.forEach(function (action) {
          const title = `Style: ${style}, Image Size: ${imageSize}, Image Position: ${imagePosition}, Action: ${existsYesNo(
            action
          )}`;
          const pageComponent = createComponent({
            style: style,
            title: title,
            cardImagePosition: imagePosition,
            cardImageSize: imageSize,
          });
          const card = createCard({
            title: TEXT_SHORT,
            description: TEXT_MEDIUM,
            image: IMAGE_SQUARE,
            action: action,
          });
          pageComponent.cards.push(card);
          thumbnailOptionsPage.components.push(pageComponent);
        });
      });
    });
  });

  component.cards.push(
    createCard({
      title: thumbnailOptionsPage.title,
      description: thumbnailOptionsPage.header.subtitle,
      actionPage: thumbnailOptionsPage.id,
    })
  );

  // THUMBNAIL CARDS: TEXT LENGTH

  const thumbnailTextLengthPage = createPage({
    title: "Thumbnail Card",
    header: createHeader({
      title: "Thumbnail Card",
      subtitle: "Text Length",
    }),
  });

  TEXT_SHORT_MEDIUM.forEach(function (text) {
    const title = `Text length: ${text.length}`;
    const pageComponent = createComponent({
      title: title,
      cardImagePosition: "left",
      cardImageSize: "contain",
    });
    const card = createCard({
      title: text,
      description: text,
      image: IMAGE_SQUARE,
    });
    pageComponent.cards.push(card);
    thumbnailTextLengthPage.components.push(pageComponent);
  });

  component.cards.push(
    createCard({
      title: thumbnailTextLengthPage.title,
      description: thumbnailTextLengthPage.header.subtitle,
      actionPage: thumbnailTextLengthPage.id,
    })
  );

  // IMAGE CARD: Action, Image Position, Image Size, Style

  const imageCardOptionsPage = createPage({
    title: "Image Card",
    header: createHeader({
      title: "Image Card",
      subtitle: "Action, Image Position, Image Size, Style",
    }),
  });

  COMPONENT_STYLES.forEach(function (style) {
    IMAGE_SIZES.forEach(function (imageSize) {
      IMAGE_POSITIONS_TOP_BOTTOM.forEach(function (imagePosition) {
        CARD_CONTENT_CONFIGURATIONS.forEach(function (contentConfig) {
          ACTIONS.forEach(function (action) {
            const title = `Style: ${style}, Image Size: ${imageSize}, Image Position: ${imagePosition}, Action: ${existsYesNo(
              action
            )}`;
            const pageComponent = createComponent({
              style: style,
              title: title,
              cardImagePosition: imagePosition,
              cardImageSize: imageSize,
            });
            const card = createCard({
              title: contentConfig.title,
              description: contentConfig.description,
              image: IMAGE_SQUARE,
              action: action,
            });
            pageComponent.cards.push(card);
            imageCardOptionsPage.components.push(pageComponent);
          });
        });
      });
    });
  });

  component.cards.push(
    createCard({
      title: imageCardOptionsPage.title,
      description: imageCardOptionsPage.header.subtitle,
      actionPage: imageCardOptionsPage.id,
    })
  );
};

const createTestsHorizontalList = () => {
  const component = createComponent({
    title: "Horizontal Card List",
  });
  _rootPage.components.push(component);

  const page = createPage({
    title: component.title,
    header: createHeader({
      title: component.title,
    }),
  });

  const cardsContents = [
    {
      title: "Short Title",
      description: "Short Description",
    },
    {
      title: "Short title",
      description: "Medium length description is what goes here",
    },
    {
      title: "Short Title only",
      description: null,
    },
    {
      title: null,
      description: "Short Description only",
    },
    {
      title: "Medium length title is what goes here and maybe another line",
      description: null,
    },
  ];

  COMPONENT_STYLES.forEach(function (style) {
    IMAGE_SIZES_NO_FULL.forEach(function (imageSize) {
      IMAGE_POSITIONS_TOP_BOTTOM.forEach(function (imagePosition) {
        ACTIONS.forEach(function (action) {
          const title = `Style: ${style}, Image Size: ${imageSize}, Image Position: ${imagePosition}, Action: ${existsYesNo(
            action
          )}`;
          const pageComponent = createComponent({
            style: style,
            title: title,
            cardImagePosition: imagePosition,
            cardImageSize: imageSize,
            cardType: "horizontal",
          });
          const images = [IMAGE_WIDE, null];
          images.forEach(function (image) {
            cardsContents.forEach(function (cardConent) {
              const card = createCard({
                title: cardConent.title,
                description: cardConent.description,
                image: image,
                action: action,
              });
              pageComponent.cards.push(card);
            });
          });
          page.components.push(pageComponent);
        });
      });
    });
  });

  component.cards.push(createTextCard(page.title, page.id));
};

const createTestsSimpleList = () => {
  const component = createComponent({
    title: "Simple List",
  });
  _rootPage.components.push(component);

  const page = createPage({
    title: component.title,
    header: createHeader({
      title: component.title,
    }),
  });

  const cardsContents = [
    {
      title: "Short Title",
      description: "Short Description",
    },
    {
      title: "Short title",
      description: "Medium length description is what goes here",
    },
    {
      title: "Short Title only",
      description: null,
    },
    {
      title: null,
      description: "Short Description only",
    },
    {
      title: "Medium length title is what goes here and maybe another line",
      description: null,
    },
  ];

  COMPONENT_STYLES.forEach(function (style) {
    const title = `Style: ${style}`;
    const pageComponent = createComponent({
      style: style,
      title: title,
      cardImagePosition: "none",
      cardImageSize: "none",
      cardType: "simple",
    });
    cardsContents.forEach(function (cardConent) {
      const card = createCard({
        title: cardConent.title,
        description: cardConent.description,
      });
      pageComponent.cards.push(card);
    });
    page.components.push(pageComponent);
  });

  component.cards.push(createTextCard(page.title, page.id));
};

const createTestsViewAll = () => {
  const component = createComponent({
    title: "View all",
  });
  _rootPage.components.push(component);
  const lists = [
    {
      cardType: "standard",
      cardImagePosition: "left",
      cardImageSize: "cover",
      cardImage: IMAGE_SQUARE,
      cardTitle: TEXT_SHORT,
      cardDescription: TEXT_SHORT,
    },
    {
      cardType: "horizontal",
      cardImagePosition: "top",
      cardImageSize: "cover",
      cardImage: IMAGE_SQUARE,
      cardTitle: TEXT_SHORT,
      cardDescription: TEXT_SHORT,
    },
    {
      cardType: "simple",
      cardImagePosition: "none",
      cardImageSize: "none",
      cardImage: null,
      cardTitle: TEXT_SHORT,
      cardDescription: TEXT_SHORT,
    },
  ];
  lists.forEach(function (list) {
    const title = `View all: ${list.cardType}`;
    const page = createPage({
      title: title,
      header: createHeader({
        title: title,
      }),
    });
    const pageComponent = createComponent({
      title: title,
      cardImagePosition: list.cardImagePosition,
      cardImageSize: list.cardImageSize,
      cardType: list.cardType,
      maxCards: 3,
      viewAllText: "View all",
    });
    const numCards = 10;
    for (let i = 0; i < numCards; i++) {
      const card = createCard({
        image: list.cardImage,
        title: list.cardTitle,
        description: list.cardDescription,
      });
      pageComponent.cards.push(card);
    }
    page.components.push(pageComponent);
    component.cards.push(createTextCard(title, page.id));
  });
};

const createTestContentComponent = () => {
  const component = createComponent({
    title: "Content Component",
  });
  _rootPage.components.push(component);
  COMPONENT_STYLES.forEach(function (style) {
    const title = `Style: ${style}`;
    const pageTitle = `${component.title}: ${title}`;
    const page = createPage({
      title: pageTitle,
      header: createHeader({
        title: pageTitle,
      }),
    });
    const pageComponent = createComponent({
      style: style,
      title: null,
      subtitle: null,
      cardImagePosition: "none",
      cardImageSize: "none",
      cardType: "content",
    });
    const pageComponentCard = createCard({
      title: null,
      description: TEXT_LONG,
    });
    pageComponent.cards.push(pageComponentCard);
    page.components.push(pageComponent);
    component.cards.push(createTextCard(title, page.id));
  });
};

const createHeader = (args) => {
  return {
    pretitle: args.pretitle,
    title: args.title,
    subtitle: args.subtitle,
    image: args.image || IMAGE_SQUARE,
    contentPosition: args.contentPosition || "overlay",
    imageSize: args.imageSize || "cover",
  };
};

const createPage = (args) => {
  const defaultPageType = "nested";
  const defaultHeader = createHeader({
    title: args.title,
  });
  const page = {
    id: _pageIndex++,
    title: args.title,
    pageType: args.pageType || defaultPageType,
    header: args.header || defaultHeader,
    components: args.components || new Array(0),
  };
  _pages.push(page);
  return page;
};

const createComponent = (args) => {
  const defaultCardType = "standard";
  const defaultStyle = "default";
  const defaultCardImageSize = "none";
  const defaultCardImagePosition = "none";
  const defaultMaxCards = 5;
  const defaultViewAllText = "View all";
  return {
    id: _componentIndex++,
    cardType: args.cardType || defaultCardType,
    style: args.style || defaultStyle,
    title: args.title,
    subtitle: args.subtitle,
    cardImageSize: args.cardImageSize || defaultCardImageSize,
    cardImagePosition: args.cardImagePosition || defaultCardImagePosition,
    maxCards: args.maxCards || defaultMaxCards,
    viewAllText: args.viewAllText || defaultViewAllText,
    cards: args.cards || new Array(0),
  };
};

const createCard = (args) => {
  let action = null;
  if (args.actionPage) {
    action = {
      type: "page",
      value: args.actionPage,
    };
  }
  return {
    id: _cardIndex++,
    image: args.image,
    title: args.title,
    description: args.description,
    action: args.action || action,
  };
};

const createTextCard = (description, actionPage) => {
  return createCard({
    description: description,
    actionPage: actionPage,
  });
};

/**
 * Returns "yes" or "no" depending on if `text` is null or not.
 * @param {object} text
 * @returns {string}  "yes" if the object is not null. "no" if the object is not null.
 */
const existsYesNo = (text) => {
  return text ? "yes" : "no";
};

/** Generate the mock file */
const generateMock = () => {
  _rootPage = createPage({
    title: "Testing Program",
    pageType: "root",
  });

  createTestsCardComponents();
  createTestsHorizontalList();
  createTestsSimpleList();
  createTestsViewAll();
  createTestContentComponent();
  createTestsHeadersContentPositionAndImageSize();
  createTestsHeadersContent();
  createTestsComponentTitles();

  const program = {
    id: 1,
    title: "Testing program",
    startDate: "2021-08-04",
    endDate: "2021-08-29",
    pages: _pages,
  };

  const jsonString = JSON.stringify(program, null, 2);
  fs.writeFile(__dirname + "/program-test.json", jsonString, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
};

generateMock();
