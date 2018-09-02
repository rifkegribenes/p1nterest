import React from "react";
import PropTypes from "prop-types";

import Typography from "@material-ui/core/Typography";

const Home = props => (
  <div className={props.classes.container}>
    <div className={props.classes.row}>
      <Typography
        variant="display1"
        align="center"
        gutterBottom
        style={{ paddingTop: 20 }}
      >
        Pinterest Clone
      </Typography>
    </div>
  </div>
);

Home.propTypes = {
  classes: PropTypes.object
};

export default Home;
