import React from "react";
import "./MyComponent.css";
import Profiles from "./Profiles";

const name = "name";
const styles = {
  fontSize: "10rem",
};

interface Props {
  title: string;
  description: string;
}

function MyComponent({ title, description }: Props) {
  //const { title } = props;
  //const title = props.title;
  function handleClick() {
    alert("Click Alert");
  }

  return (
    <React.Fragment>
      <Profiles />
      <h1 style={styles}>Hello test</h1>
      <p>{name}</p>
      <p className="read-the-docs">Test1</p>
      <p className="read-the-docs">{description}</p>
      <p>{title || "Test2"}</p>

      <button onClick={handleClick}>Click me!</button>
    </React.Fragment>
  );
}

export default MyComponent;
