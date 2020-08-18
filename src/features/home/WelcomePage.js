import React, { useEffect } from 'react';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Slide from "@material-ui/core/Slide";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Grid from "@material-ui/core/Grid";
// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Parallax from "components/Parallax/Parallax.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
// sections for this page
import SectionModal from "features/common/sections/SectionModal.js";
// style for this page
import welcomePageStyle from "./jss/welcomePageStyle.js";
// resource file
import image from "images/background.png";
// hooks
import { useOpenModal } from 'features/common/redux/hooks';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const useStyles = makeStyles(welcomePageStyle);

export default function WelcomePage() {
  const { openModal } = useOpenModal();
  const classes = useStyles();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  });
  
  return (
    <div 
      className={classes.navigation}
      style={{ backgroundImage: "url(" + image + ")" }}
    >
      <Header
        brand="YFII"
        color="transparent"
        links={<HeaderLinks/>}
      />
        <GridContainer spacing={3} className={classes.gridContainer}>
          <GridItem xs={4} >
            <div className={classes.yfiiSize}>
              YFII
            </div>
            <br/>
            <h6 className={classes.text}>
              A Better Way For Everyone To Get Rich.
            </h6>
          </GridItem>
          <GridItem xs>

          </GridItem>
          <GridItem xs={4}>
            <div>
              <h6 className={classes.text}>
                This porject is in beta, Use at your own risk.
                <br />
                Connect your wallet to continue.
              </h6>
              <Button color="rose" round onClick={openModal}>
                Connect
              </Button>
            </div>
          </GridItem>
        </GridContainer>
      <div className={classes.main, classes.mainRaised}>

      </div>
      <SectionModal />
    </div>
  );
}
