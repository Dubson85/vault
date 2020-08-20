import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import BigNumber from "bignumber.js";
import { withRouter } from "react-router";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

import FlashOnIcon from '@material-ui/icons/FlashOn';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import BarChartIcon from '@material-ui/icons/BarChart';
import PieChartIcon from '@material-ui/icons/PieChart';
// @material-ui/icons
import Close from "@material-ui/icons/Close";
// sections for this page
// style for this page
import sectionModalStyle from "../jss/sections/sectionModalStyle.js";
// hooks
import { useSnackbar } from 'notistack';

import history from 'common/history'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const useStyles = makeStyles(sectionModalStyle);

function SectionModal(props) {
  const { t, i18n } = useTranslation();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const handleClick = () => {
    const func = props.modalOpen.func;
    func()
    props.setModalOpen({
      isOpen: false,
      depositedTime: 0,
      func: null
    })
  }

  const handleClose = () =>{
    props.setModalOpen({
      isOpen: false,
      depositedTime: 0,
      func: null
    })
  }

  const formatDuring = (mss) => {
    // var days = parseInt(mss / (1000 * 60 * 60 * 24));
    var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
    // var seconds = (mss % (1000 * 60)) / 1000;
    return hours + " hours " + minutes + " minutes";
  }

  const byDecimals = number => {
    const decimals = new BigNumber(10).exponentiatedBy(18);
    return new BigNumber(number).dividedBy(decimals).toFormat(4);
  }
  
  return (
    <Dialog
      classes={{
        root: classes.modalRoot,
        paper: classes.modal
      }}
      open={props.modalOpen.isOpen}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      onClick={(event) => event.stopPropagation()}
      onFocus={(event) => event.stopPropagation()}
      aria-labelledby="classic-modal-slide-title"
      aria-describedby="classic-modal-slide-description"
    >
      <DialogTitle
        id="classic-modal-slide-title"
        disableTypography
        className={classes.modalHeader}
      >
        <Button
          simple="true"
          className={classes.modalCloseButton}
          key="close"
          aria-label="Close"
          onClick={handleClose}
        >
          {" "}
          <Close className={classes.modalClose} />
        </Button>
        <h4 className={classes.modalTitle}>{t('Vault-Modal-Title')}</h4>
      </DialogTitle>
      <DialogContent
        id="classic-modal-slide-description"
        className={classes.modalBody}
      >
        <p>{t('Vault-Modal-Content')}</p>
        <p style={{color: "red"}}>{t('Vault-Modal-Amount')} {
            new BigNumber(props.modalOpen.depositedTime).dividedBy(
              new BigNumber(1000*60*60*24)
            ).multipliedBy(
              new BigNumber(props.pool.claimAbleBalance).dividedBy(
                new BigNumber(10).exponentiatedBy(18)
              )
            ).toFormat(4)
        }</p>
        <p>
          {t('Vault-Modal-Ratio')}{Number(props.modalOpen.depositedTime*100/(1000*60*60*24)).toFixed(1)}%<br/>
          {t('Vault-Modal-TIme')}{formatDuring((1000*60*60*24)-props.modalOpen.depositedTime)}
        </p>
      </DialogContent>
      <DialogActions className={classes.modalFooter}>
        <Button onClick={handleClose} color="secondary">
         {t('Vault-Modal-CloseButton')}
        </Button>
        <Button color="primary" onClick={handleClick}>{t('Vault-Modal-ConfirmButton')}</Button>
      </DialogActions>
    </Dialog>   
  );
}

export default withRouter(SectionModal);