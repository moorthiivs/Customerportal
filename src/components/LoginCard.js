import React from "react";
import { Card } from "react-rainbow-components";
import styled from "styled-components";

import "./LoginCard.css";
const StyledCard = styled(Card)`
  width: 300px;
  height: 363px;
  opacity: 0.9;
`;

const LoginCard = (props) => {
  return (
    <div className="centered">
      <StyledCard
        className="rainbow-flex
        rainbow-flex_column 
        rainbow-align_center 
        rainbow-justify_space-around 
        rainbow-p-vertical_small 
        rainbow-m-around_small flex-center"
      >
        {props.children}
      </StyledCard>
    </div>
  );
};

export default LoginCard;
