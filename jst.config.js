const nextJest = require("next/jest");
const createJestConfig = nextJest({ dir: "./" });

const customJestConfig = {
  testPathIgnorePattern: ["<rootDir>/.next", "<rootDir>/node_modules/"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleDirectories: ["node_modules", "<rootDir>/src"],
  testEnvironment: "jsDom",
};
module.exports = createJestConfig(customJestConfig);
