const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./src/page-template.js");


// TODO: Write Code to gather information about the development team members, and render the HTML file.

const teamMembers = [];

const questions = [
    {
        type: "input",
        name: "name",
        message: "Enter the team manager's name:",
    },
    {
        type: "input",
        name: "id",
        message: "Enter the team manager's employee ID:",
    },
    {
        type: "input",
        name: "email",
        message: "Enter the team manager's email:",
    },
    {
        type: "input",
        name: "officeNumber",
        message: "Enter the team manager's office number:",
    },
    {
        type: "list",
        name: "memberType",
        message: "Select the type of team member to add:",
        choices: ["Engineer", "Intern", "Finish building the team"],
    },
];

function addManager() {
    inquirer
    .prompt(questions)
    .then((answers) => {
        const manager = new Manager(
            answers.name,
            answers.id,
            answers.email,
            answers.officeNumber
        );
        teamMembers.push(manager);
        if (answers.memberTYPE === "Finish building the team") {
            finishBuildingTeam();
        }else {
            addTeamMember(answers.memberTYPE);
        }
    })
    .catch((error) => {
        console.error("Error occuried:", error);
    });
}

function addTeamMember(memberType) {
    const memberQuestions = [
      {
        type: "input",
        name: "name",
        message: `Enter the ${memberType}'s name:`,
      },
      {
        type: "input",
        name: "id",
        message: `Enter the ${memberType}'s employee ID:`,
      },
      {
        type: "input",
        name: "email",
        message: `Enter the ${memberType}'s email:`,
      },
      {
        type: "input",
        name: memberType === "Engineer" ? "github" : "school",
        message:
          memberType === "Engineer"
            ? `Enter the ${memberType}'s GitHub username:`
            : `Enter the ${memberType}'s school:`,
      },
      {
        type: "list",
        name: "memberType",
        message: "Select the type of team member to add:",
        choices: ["Engineer", "Intern", "Finish building the team"],
      },
    ];
  
    inquirer
      .prompt(memberQuestions)
      .then((answers) => {
        if (memberType === "Engineer") {
          const engineer = new Engineer(
            answers.name,
            answers.id,
            answers.email,
            answers.github
          );
          teamMembers.push(engineer);
        } else {
          const intern = new Intern(
            answers.name,
            answers.id,
            answers.email,
            answers.school
          );
          teamMembers.push(intern);
        }
  
        if (answers.memberType === "Finish building the team") {
          finishBuildingTeam();
        } else {
          addTeamMember(answers.memberType);
        }
      })
      .catch((error) => {
        console.error("Error occurred:", error);
      });
  }

  function finishBuildingTeam() {
    const html = render(teamMembers);
    fs.ensureDirSync(OUTPUT_DIR);
    fs.writeFileSync(outputPath, html);
    console.log(`Team profile generated at ${outputPath}`);
  }
  
  addManager();