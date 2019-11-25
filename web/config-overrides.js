const { override, fixBabelImports, addLessLoader } = require("customize-cra");

const large = "36px";

module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: "scss",
    style: true
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      "@btn-height-lg": large,
      "@input-height-lg": large,
      "@avatar-size-lg": large
    }
  })
);
