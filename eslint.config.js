import globals from "globals";

export default [
    {
        files: ["scripts/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.node
            }
        }
    }
];
