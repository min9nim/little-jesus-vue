module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/essential", "@vue/prettier", "@vue/typescript"],
  rules: {
    "no-unused-vars": ["warn"],
    "prettier/prettier": ["error", {"semi": false}],
    "no-console": "warn",
    "no-debugger": "warn",
    "object-curly-spacing": "off",
  },
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
}
// https://pravusid.kr/javascript/2019/03/10/eslint-prettier.html
// https://joshua1988.github.io/web-development/vuejs/boost-productivity/#eslint%EC%99%80-prettier%EB%A5%BC-%EB%B7%B0-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8%EC%97%90-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0