import "./card.index.css";
type ComponentExtra = {
  Component: React.FunctionComponent;
  props?: any;
  isBordered: boolean;
};

export default ({ Component, isBordered = true }: ComponentExtra) => {
  return (
    <section
      className="bsc-card"
      style={{
        border: isBordered ? "1px solid #E8E8E8" : "unset",
        display: "block",
        width: "100%",
      }}
    >
      <Component />
    </section>
  );
};
