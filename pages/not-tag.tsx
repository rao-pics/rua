import Page from "./index";

const NoTagPage = () => {
  return <Page AND={{ tags: { none: {} } }} />;
};

export default NoTagPage;
