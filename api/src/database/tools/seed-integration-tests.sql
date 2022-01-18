/*
 * VS Code will auto format this file on save, but it causes issues with the `DELIMITER //` lines.
 * To save without auto formating: "Control/Cmd + Shift + P" and choose "File: Save without formatting"
 * Shortcut: (Control + k) + (Control + Shift + s)
 */

/* 
 * Run this script to seed the database with data that can be used to test the digital program book.
 * Script was specifically created for `api/test/integration/lambdas/client_getOneProgram.test.ts`.
 */

/* 
 * RESET
 *
 * Warning: If you run the lines below you will delete all existing data from the database.
 */
-- DELETE FROM cards;
-- DELETE FROM components;
-- DELETE FROM programs;
-- DELETE FROM pages;

DROP PROCEDURE IF EXISTS insertPage;
DROP PROCEDURE IF EXISTS insertProgram;
DROP PROCEDURE IF EXISTS insertComponent;
DROP PROCEDURE IF EXISTS insertCard;

/* VARIABLES */

SET @clientId = 1;
SET @timeZone = 'Pacific';
SET @programStatusPublished = 'published';
SET @pageStatusOk = 'ok';
SET @componentStatusOk = 'ok';
SET @viewAllText = 'View all';
SET @componentTypeTextCard = 'text';
SET @componentTypeVerticalList = 'verticalList';
SET @componentTypeHorizontalList = 'horizontalList';
SET @componentStyleDefault = 'default';
SET @componentStyleSpotlight = 'spotlight';
SET @componentVisibleTrue = 1;
SET @cardImagePositionNone =  'none';
SET @cardImagePositionLeft = 'left';
SET @cardImagePositionRight = 'right';
SET @cardImagePositionTop = 'top';
SET @cardImagePositionBottom = 'bottom';
SET @cardImageSizeNone = 'none';
SET @cardImageSizeCover = 'cover';
SET @cardImageSizeContain = 'contain';
SET @cardImageSizeFull = 'full';
SET @cardVisibleTrue = 1;
SET @actionNone = 'none';
SET @actionLink = 'link';
SET @actionPage = 'page';
SET @cardImageUrlNull = ''; -- because field doesn't allow null right now
SET @cardVisibileTrue = 1;

/* PROCEDURES */

DELIMITER //

CREATE PROCEDURE insertPage(
	IN headerImageSize varchar(255), 
    IN headerTextPosition varchar(255), 
    IN internalName varchar(255), 
    IN headerImageUrl varchar(255), 
    IN headerPreTitle varchar(255), 
    IN headerSubTitle varchar(255), 
    IN headerTitle varchar(255), 
    OUT id INT)
BEGIN
	INSERT INTO pages (headerImageSize, headerTextPosition, internalName, headerImageUrl, headerPreTitle, headerSubTitle, headerTitle, `status`) VALUES 
	(
		headerImageSize,
		headerTextPosition,
		internalName,
		headerImageUrl,
		headerPreTitle,
		headerSubTitle,
		headerTitle,
    @pageStatusOk
	);
	SET id = (SELECT LAST_INSERT_ID());
END //

CREATE PROCEDURE insertProgram(
	IN id INT, 
    IN localEndDate date, 
    IN localStartDate date, 
    IN `status` varchar(255), 
    IN timeZone varchar(255), 
    IN utcEndDate date, 
    IN utcStartDate date)
BEGIN
	INSERT INTO programs (id, clientId, localEndDate, localStartDate, `status`, timeZone, utcEndDate, utcStartDate) VALUES 
	(
		id, 
    @clientId,
		localEndDate, 
		localStartDate, 
		`status`, 
		timeZone, 
		utcEndDate, 
		utcStartDate
	);
END //

CREATE PROCEDURE insertComponent(
    IN `type` varchar(255),
    IN pageId INT, 
    IN orderIndex INT,
    IN style varchar(255),
    IN internalName varchar(255),
    IN title varchar(255),
    IN subTitle varchar(255),
    IN cardImagePosition varchar(255),
    IN cardImageSize varchar(255),
    IN `visible` tinyint(1),
    IN maxCards INT,
    IN viewAllText varchar(255),
    IN `status` varchar(255),
    OUT componentId INT
)
BEGIN
	INSERT INTO components (`type`, libraryComponent, ad, style, internalName, title, subTitle, cardImagePosition, cardImageSize, `visible`, maxCards, viewAllText, `status`) VALUES 
	(
    `type`,
		0, -- libraryComponent
        0, -- ad
        style,
        internalName,
        title,
        subTitle,
        cardImagePosition,
        cardImageSize,
        `visible`,
        maxCards,
        viewAllText,
        `status`
	);
	SET componentId = (SELECT LAST_INSERT_ID());
    
    INSERT INTO pageComponents (orderIndex, componentId, pageId, datesOverrideMode) VALUES 
    (
		orderIndex,
        componentId,
        pageId,
        'none' -- datesOverrideMode
    );
END //

CREATE PROCEDURE insertCard(
	IN componentId INT, 
    IN orderIndex INT,
    IN pageId INT,
    IN `action` varchar(255),
    IN imageUrl varchar(255),
    IN url varchar(255),
    IN `description` text,
    IN title varchar(255),
    IN `visible` tinyint(1),
    OUT cardId INT
)
BEGIN
	INSERT INTO cards (componentId, orderIndex, pageId, `action`, imageUrl, url, `description`, title, `visible`) VALUES 
	(
		componentId,
    orderIndex,
    pageId,
    `action`,
    imageUrl,
    url,
    `description`,
    title,
    `visible`
	);
	SET cardId = (SELECT LAST_INSERT_ID());
END //
    
DELIMITER ;

/* INSERT DATA */

/* PAGE: Program Home */

CALL insertPage(
	'cover',   -- headerImageSize
	'overlay', -- headerTextPosition
	'Blindness 2021',  -- internalName
	'https://s3.amazonaws.com/data.instantencore.com/image/1074084/beethoven.jpg', -- headerImageUrl
	'David Mirvish Productions Presents', -- headerPreTitle
	'Aug 4 - 29', -- headerSubTitle
	'Blindness', -- headerTitle
	@pageId
);

CALL insertProgram
(
	@pageId, -- id
	'2021-10-01', -- localEndDate
	'2021-08-01', -- localStartDate
	@programStatusPublished, -- status
	@timeZone, -- timeZone
	'2021-10-01 07:00',  -- utcEndDate
	'2021-08-01 07:00'  -- utcStartDate
);

	CALL insertComponent
	(
    @componentTypeTextCard, -- type
	  @pageId,
	  1, -- orderIndex
	  @componentStyleDefault, -- style
	  'A note from artistic director',  -- internalName
	  'A note from Donmar Artistic Director Michael Longhurst', -- title
	  null, -- subtitle
	  @cardImagePositionNone, -- cardImagePosition
	  @cardImageSizeNone, -- cardImagePosition
	  @componentVisibleTrue, -- visilble
	  1, -- maxCard
	  @viewAllText,
	  @componentStatusOk,
	  @componentId
	);

		CALL insertCard(
			@componentId,
			1, -- orderIndex
			null,  -- pageId
			@actionPage, -- action
			@cardImageUrlNull, -- imageUrl
			null, -- url
			'View', -- description
			null, -- title
			@cardVisibileTrue, -- visible
			@cardIdDirectorsNote
		);

	CALL insertComponent
	(
    @componentTypeVerticalList, -- type
	  @pageId,
	  2, -- orderIndex
	  @componentStyleSpotlight, -- style
	  'Watch & Listen',  -- internalName
	  'Watch & Listen', -- title
	  null, -- subtitle
	  @cardImagePositionLeft, -- cardImagePosition
	  @cardImageSizeCover, -- cardImagePosition
	  @componentVisibleTrue, -- visilble
	  2, -- maxCard
	  @viewAllText,
	  @componentStatusOk,
	  @componentId
	);

		CALL insertCard(
			@componentId,
			1, -- orderIndex
			null,  -- pageId
			@actionLink, -- action
			'https://img.youtube.com/vi/mTZDZZKd87g/1.jpg', -- imageUrl
			'https://www.youtube.com/watch?v=mTZDZZKd87g', -- url
			'YouTube', -- description
			null, -- title
			@cardVisibileTrue, -- visible
			@cardId
		);

		CALL insertCard(
			@componentId,
			2, -- orderIndex
			null,  -- pageId
			@actionLink, -- action
			'https://i1.sndcdn.com/artworks-nDCGqM2pnO7WrtCZ-UIXvuA-t500x500.jpg', -- imageUrl
			'https://soundcloud.com/donmarwarehouse/reclaiming-blindness', -- url
			'SoundCloud', -- description
			null, -- title
			@cardVisibileTrue, -- visible
			@cardId
		);

	CALL insertComponent
	(
    @componentTypeHorizontalList, -- type
	  @pageId,
	  2, -- orderIndex
	  @componentStyleDefault, -- style
	  'Bios',  -- internalName
	  'Who''s Who', -- title
	  null, -- subtitle
	  @cardImagePositionLeft, -- cardImagePosition
	  @cardImageSizeCover, -- cardImagePosition
	  @componentVisibleTrue, -- visilble
	  2, -- maxCard
	  @viewAllText,
	  @componentStatusOk,
	  @componentId
	);

		CALL insertCard(
			@componentId,
			1, -- orderIndex
			null,  -- pageId
			@actionLink, -- action
			'https://s3.amazonaws.com/data.instantencore.com/image/1074084/beethoven.jpg', -- imageUrl
			'https://test.com/bio', -- url
			'Voice of the Storyteller / Doctor''s wife', -- description
			'JULIET STEVENSON', -- title
			@cardVisibileTrue, -- visible
			@cardId
		);
        
		CALL insertCard(
			@componentId,
			2, -- orderIndex
			null,  -- pageId
			@actionLink, -- action
			'https://s3.amazonaws.com/data.instantencore.com/image/1074084/beethoven.jpg', -- imageUrl
			'https://test.com/bio', -- url
			'Writer', -- description
			'SIMON STEPHENS', -- title
			@cardVisibileTrue, -- visible
			@cardId
		);

/* PAGE: Director's Note*/

CALL insertPage(
	'cover',   -- headerImageSize
	'overlay', -- headerTextPosition
	'Director''s Note',  -- internalName
	'https://s3.amazonaws.com/data.instantencore.com/image/1074084/beethoven.jpg', -- headerImageUrl
	null, -- headerPreTitle
	'Director Walter M explores his 20 year journey with <i>Blindness</i>', -- headerSubTitle
	'An Introduction to <i>Blindness</i>', -- headerTitle
	@pageIdDirectorsNote
);

	CALL insertComponent
	(
    @componentTypeTextCard,
	  @pageIdDirectorsNote,
	  1, -- orderIndex
	  @componentStyleDefault, -- style
	  'A note from artistic director',  -- internalName
	  null, -- title
	  null, -- subtitle
	  @cardImagePositionNone, -- cardImagePosition
	  @cardImageSizeNone, -- cardImagePosition
	  @componentVisibleTrue, -- visilble
	  1, -- maxCard
	  @viewAllText,
	  @componentStatusOk,
	  @componentId
	);

		CALL insertCard(
			@componentId,
			1, -- orderIndex
			null,  -- pageId
			@actionNone, -- action
			@cardImageUrlNull, -- imageUrl
			null, -- url
			'<p>I discovered the work of writer José Saramago in the mid 1990s. In 1999 whilst assisting on the opera <i>Aida</i> in Amsterdam, I read <i>Blindness</i> in one session, it took my breath away. It was dark, incredibly dark and such a provocation for the reader to imagine a world in which everyone except one woman had gone blind. Saramago who in the meantime had won the Nobel Prize for Literature asked the question: How would we as human beings react to a breakdown of civilisation in the form of an epidemic? Soon after finishing the book, I started to think, could this novel be adapted for the stage?</p>', -- description
			null, -- title
			@cardVisibileTrue, -- visible
			@cardId
		);

UPDATE cards SET pageId = @pageIdDirectorsNote where id = @cardIdDirectorsNote;

-- clean up
DROP PROCEDURE insertPage;
DROP PROCEDURE insertProgram;
DROP PROCEDURE insertComponent;
DROP PROCEDURE insertCard;
