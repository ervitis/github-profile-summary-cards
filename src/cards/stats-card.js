const Themes = require("../const/theme");
const Icons = require("../const/icon");
const NumAbbr = require("number-abbreviate");
const getProfileDetails = require("../github-api/profile-details");
const getContributionByYear = require("../github-api/contributions-by-year");
const statsCard = require("../templates/stats-card");
const { writeSVG, outputPath } = require("../utils/file-writer");

const createStatsCard = async function (args) {
  let userDetails = await getProfileDetails(args.username);
  let totalStars = userDetails.totalStars;
  let totalCommitContributions = 0;
  let totalPullRequestContributions = 0;
  let totalIssueContributions = 0;
  let totalRepositoryContributions = 0;
  for (let year of userDetails.contributionYears) {
    let contributions = await getContributionByYear(args.username, year);
    totalCommitContributions += contributions.totalCommitContributions;
    totalPullRequestContributions +=
      contributions.totalPullRequestContributions;
    totalIssueContributions += contributions.totalIssueContributions;
    totalRepositoryContributions += contributions.totalRepositoryContributions;
  }
  let numAbbr = new NumAbbr();
  let statsData = [
    {
      index: 0,
      icon: Icons.STAR,
      name: "Total Stars:",
      value: `${numAbbr.abbreviate(totalStars, 1)}`,
    },
    {
      index: 1,
      icon: Icons.COMMIT,
      name: "Total Commits:",
      value: `${numAbbr.abbreviate(totalCommitContributions, 1)}`,
    },
    {
      index: 2,
      icon: Icons.PULL_REQUEST,
      name: "Total PRs:",
      value: `${numAbbr.abbreviate(totalPullRequestContributions, 1)}`,
    },
    {
      index: 3,
      icon: Icons.ISSUE,
      name: "Total Issues:",
      value: `${numAbbr.abbreviate(totalIssueContributions, 1)}`,
    },
    {
      index: 4,
      icon: Icons.REPOS,
      name: "Contributed to:",
      value: `${numAbbr.abbreviate(totalRepositoryContributions, 1)}`,
    },
  ];

  if (args.theme) {
    let svgString = statsCard("Stats", statsData, Themes[args.theme]);
    //output to folder, use 3- prefix for sort in preview
    writeSVG(args.theme, "3-stats", svgString);
    return
  }

  for (let themeName in Themes) {
    let theme = Themes[themeName];
    let svgString = statsCard("Stats", statsData, theme);
    //output to folder, use 3- prefix for sort in preview
    writeSVG(themeName, "3-stats", svgString);
  }
};

module.exports = createStatsCard;
