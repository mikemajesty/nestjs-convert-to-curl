"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_jest_1 = require("ts-jest");
const tsconfig_json_1 = require("./tsconfig.json");
exports.default = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    coveragePathIgnorePatterns: ['dist', 'node_modules', 'coverage'],
    moduleNameMapper: (0, ts_jest_1.pathsToModuleNameMapper)(tsconfig_json_1.compilerOptions.paths),
    testEnvironment: 'node'
};
