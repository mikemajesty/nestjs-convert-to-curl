// jest.config.ts
export default {
  moduleFileExtensions: ["js", "json", "ts"],
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  transformIgnorePatterns: ["node_modules/(?!(uuid|axios)/)"],
  coveragePathIgnorePatterns: ["dist", "node_modules", "coverage"],
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
  testEnvironment: "node",
};
