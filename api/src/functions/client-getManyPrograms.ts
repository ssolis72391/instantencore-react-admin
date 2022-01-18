"use strict";
import { ProgramStatus } from "api-shared";
import { APIGatewayProxyEvent } from "aws-lambda";
import { Page, Program } from "../database/models";

class ProgramsTabClient {
  title: string;
  programSummaries: ProgramSummaryClient[];
}

class ProgramSummaryClient {
  id: number;
  header: ProgramSummaryHeaderClient;
}

class ProgramSummaryHeaderClient {
  pretitle?: string;
  title?: string;
  subtitle?: string;
  image?: string;
  contentPosition?: string;
  imageSize?: string;
}

class ProgramsFiltered {
  current: Program[];
  upcoming: Program[];
  past: Program[];
  pages: Page[];
}

export const handler = async (event: APIGatewayProxyEvent) => {
  const cid = +event.queryStringParameters.cid;
  const programsFiltered = await getProgramsFiltered(cid);
  const programTabs: ProgramsTabClient[] = [];
  programTabs.push(
    createProgramTab(
      programsFiltered.current,
      "Current",
      programsFiltered.pages
    )
  );
  programTabs.push(
    createProgramTab(
      programsFiltered.upcoming,
      "Upcoming",
      programsFiltered.pages
    )
  );
  programTabs.push(
    createProgramTab(programsFiltered.past, "Past", programsFiltered.pages)
  );
  const response = {
    statusCode: 200,
    body: JSON.stringify(programTabs),
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      /**
       * @question post for client???
       */
      "Access-Control-Allow-Methods": "OPTIONS,GET,POST",
    },
  };
  return response;
};

/**
 * Get programs (and associated pages) from the database. Group them into current, upcoming, and past.
 */
const getProgramsFiltered = async (cid: number) => {
  // Get all programs where status == published
  const programs = await Program.findAll({
    where: {
      status: ProgramStatus.published,
      clientId: cid,
    },
  });
  // Get associated pages
  const ids = programs.map((p) => p.id);
  const pages = await Page.findAll({
    where: {
      id: ids,
    },
  });
  const utcNow = new Date().getTime();
  const dayInMs = 86400000;
  // filter for current (endDateUtc.addDays(1) > utcNow) && (startDateUtc < utcNow)
  const current = programs.filter((p) => {
    const utcEndDate = new Date(p.utcEndDate).getTime() + dayInMs;
    const utcStartDate = new Date(p.utcStartDate).getTime();
    return utcEndDate > utcNow && utcStartDate < utcNow;
  });
  // filter for upcoming (startDateUtc > utcNow)
  const upcoming = programs.filter((p) => {
    const utcStartDate = new Date(p.utcStartDate).getTime();
    return utcStartDate > utcNow;
  });
  // filter for past (endDateUtc.addDays(1) < utcNow)
  const past = programs.filter((p) => {
    const utcEndDate = new Date(p.utcEndDate).getTime() + dayInMs;
    return utcEndDate < utcNow;
  });
  // grab all pages with ids in the list of ids we selected
  const programsFiltered: ProgramsFiltered = {
    current: current,
    upcoming: upcoming,
    past: past,
    pages: pages,
  };
  return programsFiltered;
};

/**
 * Transform the database data to a ProgramTabClient that will be returned.
 * @param programs Array of grouped programs (current, upcoming, or past)
 * @param title Title of the tab.
 * @param pages All associated pages so that we can retrieve header info from database
 */
const createProgramTab = (
  programs: Program[],
  title: string,
  pages: Page[]
) => {
  const programSummaries = programs.map((program) => {
    const page = pages.find((m) => m.id === program.id);
    const programSummary: ProgramSummaryClient = {
      id: program.id,
      header: {
        contentPosition: page.headerTextPosition,
        image: page.headerImageUrl,
        imageSize: page.headerImageSize,
        pretitle: page.headerPreTitle,
        subtitle: page.headerSubTitle,
        title: page.headerTitle,
      },
    };
    return programSummary;
  });
  const programTabClient: ProgramsTabClient = {
    title: title,
    programSummaries: programSummaries,
  };
  return programTabClient;
};
