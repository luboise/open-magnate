module.exports = {
	preset: 'ts-jest',
	testEnvironment: "node",
	testRegex: "./test/.*\\.(test|spec)?\\.(ts|tsx)$",
	moduleNameMapper: {
    	'^@/(.*)$': '<rootDir>/src/$1'
  	},
	moduleFileExtensions: [
		"ts",
		"tsx",
		"js",
		"jsx",
		"json",
		"node"
	],	
};
