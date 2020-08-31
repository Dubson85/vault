/* eslint-disable */
import React, { useState, useEffect, createContext } from 'react';
import { useTranslation } from 'react-i18next';
import BigNumber from "bignumber.js";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionActions'
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
import Avatar from '@material-ui/core/Avatar';
import CustomInput from "components/CustomInput/CustomInput.js";
// sections for this section
// import SectionOpenedPool from "./SectionOpenedPool";
import { useSnackbar } from 'notistack';
//  hooks
import { useAccount } from '../../common/redux/hooks';
import { useFetchBalances, useFetchPoolBalances, useFetchApproval, useFetchDeposit, useFetchClaim, useFetchWithdraw, useFetchFarm, useFetchHarvest } from '../redux/hooks';

import SectionModal from "./SectionModal";
import SectionConfirmModal from "./SectionConfirmModal";

import sectionPoolsStyle from "../jss/sections/sectionPoolsStyle";

const useStyles = makeStyles(sectionPoolsStyle);

const modalContext = createContext('modal');
const confirmModalContext = createContext('confirmModal');

export default function SectionPools() {
  const { t, i18n } = useTranslation();
  const { account, provider } = useAccount();
  const { pools, fetchPoolBalances } = useFetchPoolBalances();
  const { tokens, fetchBalances } = useFetchBalances();
  const [ openedCardList, setOpenCardList ] = useState([]);
  const classes = useStyles();

  const { fetchApproval, fetchApprovalPending } = useFetchApproval();
  const { fetchDeposit, fetchDepositPending } = useFetchDeposit();
  const { fetchClaim, fetchClaimPending } = useFetchClaim();
  const { fetchWithdraw, fetchWithdrawPending } = useFetchWithdraw();
  const { fetchFarm, fetchFarmPending } = useFetchFarm();
  const { fetchHarvest, fetchHarvestPending } = useFetchHarvest();

  const [ modal, setModal ] = useState({});

  const [ confirmModal, setConfirmModal ] = useState({});

  const [ depositedBalance, setDepositedBalance ] = useState({});
  const [ withdrawAmount, setWithdrawAmount ] = useState({});

  const { enqueueSnackbar } = useSnackbar();

  // const handleClickVariant = (variant) => () => {
  //   // variant could be success, error, warning, info, or default
  //   enqueueSnackbar('This is a success message!', { variant });
  // };
  const handleDepositedBalance = (index, event) => {
    setDepositedBalance({
      ...depositedBalance,
      [index]: event.target.value == '' ? '': Number(event.target.value)
    });
  };

  const handleWithdrawAmount = (index, event) => {
    setWithdrawAmount({
      ...withdrawAmount,
      [index]: event.target.value == '' ? '': Number(event.target.value)
    });
  };

  const byDecimals = (number, tokenDecimals = 18) => {
    const decimals = new BigNumber(10).exponentiatedBy(tokenDecimals);
    return new BigNumber(number).dividedBy(decimals);
  }

  const onApproval = (pool, index, event) => {
    event.stopPropagation();
    fetchApproval({
      account,
      provider,
      tokenAddress: pool.tokenAddress,
      contractAddress: pool.earnContractAddress,
      index
    }).then(
      () => enqueueSnackbar(`Approval success`, {variant: 'success'})
    ).catch(
      error => enqueueSnackbar(`Approval error: ${error}`, {variant: 'error'})
    )
  }

  const onDeposit = (pool, index, event) => {
    event.stopPropagation();
    fetchDeposit({
      account,
      provider,
      amount: new BigNumber(depositedBalance[index]).multipliedBy(new BigNumber(10).exponentiatedBy(pool.tokenDecimals)).toString(10),
      contractAddress: pool.earnContractAddress,
      index
    }).then(
      () => enqueueSnackbar(`Deposit success`, {variant: 'success'})
    ).catch(
      error => enqueueSnackbar(`Deposit error: ${error}`, {variant: 'error'})
    )
  }

  const onClaim = (pool, index, event) => {
    event.stopPropagation();
    // console.log('claim')
    const time = new BigNumber(pool.depositedTime).multipliedBy(1000).toNumber();
    const nowTime = new Date().getTime();
    const depositedTime = new BigNumber(nowTime).minus(time).toNumber();
    // console.log(depositedTime)
    // console.log(depositedTime)
    const func = () => {
      fetchClaim({
        account,
        provider,
        contractAddress: pool.earnContractAddress,
        index
      }).then(
        () => enqueueSnackbar(`Claim success`, {variant: 'success'})
      ).catch(
        error => enqueueSnackbar(`Claim error: ${error}`, {variant: 'error'})
      )
    }
    if (depositedTime < 1000*60*60*24) {
      console.log('setModal')
      setModal({
        ...modal,
        [index]: {
          open: true,
          depositedTime,
          func
        }
      })
    } else {
      fetchClaim({
        account,
        provider,
        contractAddress: pool.earnContractAddress,
        index
      }).then(
        () => enqueueSnackbar(`Claim success`, {variant: 'success'})
      ).catch(
        error => enqueueSnackbar(`Claim error: ${error}`, {variant: 'error'})
      )
    }    
  }

  const onWithdraw = (pool, index, event) => {
    event.stopPropagation();
    const time = new BigNumber(pool.depositedTime).multipliedBy(1000).toNumber();
    const nowTime = new Date().getTime();
    const depositedTime = new BigNumber(nowTime).minus(time).toNumber();
    const func = () => {
      fetchWithdraw({
        account,
        provider,
        amount: new BigNumber(withdrawAmount[index]).multipliedBy(new BigNumber(10).exponentiatedBy(pool.tokenDecimals)).toString(10),
        contractAddress: pool.earnContractAddress,
        index
      }).then(
        () => enqueueSnackbar(`Withdraw success`, {variant: 'success'})
      ).catch(
        error => enqueueSnackbar(`Withdraw error: ${error}`, {variant: 'error'})
      )
    }
    if (depositedTime < 1000*60*60*24) {
      setModal({
        ...modal,
        [index]: {
          open: true,
          depositedTime,
          func
        }
      })
    } else {
      fetchWithdraw({
        account,
        provider,
        amount: new BigNumber(withdrawAmount[index]).multipliedBy(new BigNumber(10).exponentiatedBy(pool.tokenDecimals)).toString(10),
        contractAddress: pool.earnContractAddress,
        index
      }).then(
        () => enqueueSnackbar(`Withdraw success`, {variant: 'success'})
      ).catch(
        error => enqueueSnackbar(`Withdraw error: ${error}`, {variant: 'error'})
      )
    }   
  }

  const onFarm = (pool, index, event) => {
    event.stopPropagation();
    const func = () => {
      fetchFarm({
        account,
        provider,
        contractAddress: pool.earnContractAddress,
        index
      }).then(
        () => enqueueSnackbar(`Farm success`, {variant: 'success'})
      ).catch(
        error => enqueueSnackbar(`Farm error: ${error}`, {variant: 'error'})
      )
    }
    setConfirmModal({
      ...confirmModal,
      [index]: {
        open: true,
        description: t('Vault-FarmButtonDescription'),
        func
      }
    })
  }

  const onHarvest = (pool, index, event) => {
    event.stopPropagation();
    const func = () => {
      fetchHarvest({
        account,
        provider,
        contractAddress: pool.strategyContractAddress,
        index
      }).then(
        () => enqueueSnackbar(`Harvest success`, {variant: 'success'})
      ).catch(
        error => enqueueSnackbar(`Harvest error: ${error}`, {variant: 'error'})
      )
    }
    setConfirmModal({
      ...confirmModal,
      [index]: {
        open: true,
        description: t('Vault-HarvestButtonDescription'),
        func
      }
    })
  }

  const openCard = id => {
    return setOpenCardList(
      openedCardList => {
        if(openedCardList.includes(id)) {
          return openedCardList.filter(item => item!==id)
        } else {
          return [...openedCardList, id]
        }
      }
    )
  } 

  // useEffect(() => {
  //   fetchBalances({account, provider, tokens});
  //   fetchPoolBalances({account, provider, pools});
  //   const id = setInterval(() => {
  //     fetchBalances({account, provider, tokens});
  //     fetchPoolBalances({account, provider, pools});
  //   }, 10000);
  //   return () => clearInterval(id);
  // }, [fetchBalances, fetchPoolBalances]);

  const forMat = number => {
    return new BigNumber(
      number
    ).multipliedBy(
      new BigNumber(10000)
    ).dividedToIntegerBy(
      new BigNumber(1)
    ).dividedBy(
      new BigNumber(10000)
    ).toNumber()
  }

  const isZh = Boolean((i18n.language == 'zh') || (i18n.language == 'zh-CN'));

  return (
    <GridContainer justify="center">
      <GridItem xs={12} sm={10}>
        {pools.map((pool, index) => {
          return (
            <Accordion
              key={index}
              expanded={Boolean(openedCardList.includes(index))}
              onChange={() => openCard(index)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                className={classes.details}
              >
                <GridItem xs={12}>
                  <GridContainer>
                    <modalContext.Provider value={{setModal, modal, index, pool}}>
                      <SectionModal context={modalContext} />
                    </modalContext.Provider>
                    <confirmModalContext.Provider value={{confirmModal, setConfirmModal, index}}>
                      <SectionConfirmModal context={confirmModalContext}/>
                    </confirmModalContext.Provider>
                    <GridItem xs={12} sm={4} style={{
                      display: "flex",
                      justifyContent : "space-around",
                      alignItems : "center",
                      alignContent: "space-around",
                    }}>
                      <GridItem xs={3}>
                        <Avatar 
                          alt={pool.token}
                          src={require(`../../../images/${pool.token}-logo.png`)}
                          style={{}}
                        />
                      </GridItem>
                      <GridItem xs={6} style={{display: "flex",alignItems : "center"}}>
                        <h2 style={{fontSize: "1.5rem", margin: 0, fontWeight: "300"}}>{pool.token}</h2>
                        {(!tokens[pool.token].tokenBalance && !pool.depositedBalance) && (
                          <HelpOutlineIcon
                            color="primary"
                            fontSize="small"
                            style={{marginLeft: "5px"}}
                            onClick={
                              event => {
                                event.stopPropagation();
                                window.open(isZh?pool.tokenDescriptionUrl2:pool.tokenDescriptionUrl)
                              }
                            }
                          />
                        )}
                      </GridItem>
                      <GridItem xs={3}>
                        <h5>{
                          forMat(
                            byDecimals(tokens[pool.token].tokenBalance, pool.tokenDecimals)
                          )
                        }</h5>
                        <h6>{t('Vault-Balance')}</h6>
                      </GridItem>
                    </GridItem>
                    {
                      openedCardList.includes(index) ? (
                        <GridItem xs={12} sm={8}
                          style={{
                            display: "flex",
                            justifyContent : "space-around",
                            alignItems : "center",
                            alignContent: "space-around"
                          }}
                        >
                          <CustomInput
                            inputProps={{
                              placeholder: `${t('Vault-Input-1')}${pool.token}${t('Vault-Input-2')}`,
                              type: "number",
                              autoComplete: "off",
                              value: depositedBalance[index] == null ? '' : depositedBalance[index],
                              onChange: handleDepositedBalance.bind(this, index),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Button 
                                    variant="outlined"
                                    round
                                    type="button"
                                    color="transparent"
                                    size="sm"
                                    style={{
                                      color: '#9c27b0',
                                      border: "1px solid #9c27b0"
                                    }}
                                    onClick={()=>{
                                      setDepositedBalance({
                                        ...depositedBalance,
                                        [index]: forMat(byDecimals(tokens[pool.token].tokenBalance, pool.tokenDecimals))
                                      })
                                    }}
                                  >Max</Button>
                                </InputAdornment>
                              )
                            }}
                            formControlProps={{
                              onClick: (event) => event.stopPropagation(),
                              onFocus: (event) => event.stopPropagation(),
                              fullWidth: true,
                              className: classes.formControl,
                            }}
                          />
                          {depositedBalance[index]>pool.allowance ? (
                            <Button
                              color="primary"
                              onClick={onApproval.bind(this, pool, index)}
                              disabled={fetchApprovalPending[index] }
                            >
                              {fetchApprovalPending[index] ? `${t('Vault-ApproveING')}` : `${t('Vault-ApproveButton')}`}
                            </Button>
                          ) : (
                            <Button
                              color="primary"
                              onClick={onDeposit.bind(this, pool, index)}
                              onFocus={(event) => event.stopPropagation()}
                              disabled={
                                !Boolean(depositedBalance[index]) || fetchDepositPending[index] || (new BigNumber(depositedBalance[index]).toNumber() > byDecimals(tokens[pool.token].tokenBalance, pool.tokenDecimals).toNumber())
                              }
                            >
                              {fetchDepositPending[index] ? `${t('Vault-DepositING')}` : `${t('Vault-DepositButton')}`}
                            </Button>
                          )}
                        </GridItem>
                      ) : (
                        <GridItem xs={12} sm={8}
                          style={{
                            display: "flex",
                            justifyContent : "space-around",
                            alignItems : "center",
                            alignContent: "space-around",
                          }}
                        >
                          <div>
                            <h5>{byDecimals(pool.depositedBalance, pool.tokenDecimals).toFormat(4)}</h5>
                            <h6>{t('Vault-ListDeposited')} { pool.token }</h6>
                          </div>
                          <div>
                            <h5>{byDecimals(pool.claimAbleBalance).toFormat(4)}</h5>
                            <h6>{t('Vault-ListEarned')} { pool.earnedToken }</h6>
                          </div>
                          <div>
                            <h5>{byDecimals(pool.claimPendingBalance).toFormat(4)}</h5>
                            <h6>{t('Vault-ListPending')} { pool.earnedToken }</h6>
                          </div>
                        </GridItem>
                      )}
                  </GridContainer>
                </GridItem>
              </AccordionSummary>
              <AccordionDetails>
                <GridItem xs={12}>
                  <GridContainer style={{alignItems:"flex-start"}}>
                    <GridItem xs={12} md={4} style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      alignContent: "space-around"
                    }}>
                      <Card className={classes.cardWrap}>
                        <CardBody style={{display: "flex", alignContent: "space-between", flexDirection:"column"}}>
                          <div style={{display: "flex", justifyContent: "space-between"}}>
                            <h4 className={classes.cardTitle}>{t('Vault-Deposited')}</h4>
                            <h4 className={classes.textRight}>{byDecimals(pool.depositedBalance, pool.tokenDecimals).toFormat(4)} {pool.token}
                            </h4>
                          </div>
                          <div>
                          <CustomInput
                            inputProps={{
                              placeholder: `${t('Vault-Input-3')}${pool.token}${t('Vault-Input-4')}`,
                              type: "number",
                              autoComplete: "off",
                              value: withdrawAmount[index] == null ? '' : withdrawAmount[index],
                              onChange: handleWithdrawAmount.bind(this, index),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <Button 
                                    variant="outlined"
                                    round
                                    type="button"
                                    color="transparent"
                                    size="sm"
                                    style={{
                                      color: '#9c27b0',
                                      border: "1px solid #9c27b0"
                                    }}
                                    onClick={()=>{
                                      setWithdrawAmount({
                                        ...withdrawAmount,
                                        [index]: byDecimals(pool.depositedBalance, pool.tokenDecimals).toNumber()

                                      })
                                    }}
                                  >Max</Button>
                                </InputAdornment>)
                              }}
                            formControlProps={{
                              onClick: (event) => event.stopPropagation(),
                              onFocus: (event) => event.stopPropagation(),
                              fullWidth: true,
                              className: classes.formControl,
                              style: {
                                paddingTop: 0
                              }
                            }}
                          />
                          </div>
                          
                          <Button
                            color="primary"
                            round
                            block
                            onClick={onWithdraw.bind(this, pool, index)}
                            disabled={fetchWithdrawPending[index] || !Boolean(withdrawAmount[index])}
                          >
                            {fetchWithdrawPending[index] ? `${t('Vault-WithdrawING')}`: `${t('Vault-WithdrawButton')}`}
                          </Button>
                        </CardBody>
                      </Card>
                    </GridItem>
                    <GridItem xs={12} md={4}>
                      <Card className={classes.cardWrap}>
                        <CardBody style={{display: "flex", alignContent: "space-between", flexDirection:"column"}}>
                          <div style={{display: "flex", justifyContent: "space-between"}}>
                            <h4 className={classes.cardTitle}>{t('Vault-Earned')}</h4>
                            <h5 className={classes.textCenter}>{byDecimals(pool.claimAbleBalance).toFormat(4)} {pool.earnedToken}</h5>
                          </div>
                          <div style={{height:"49px"}}></div>
                          <Button color="primary" round block onClick={onClaim.bind(this, pool, index)} disabled={fetchClaimPending[index]}>
                            {fetchClaimPending[index] ? `${t('Vault-ClaimING')}` : `${t('Vault-ClaimButton')}`}
                          </Button>
                        </CardBody>
                      </Card>
                    </GridItem>
                    <GridItem xs={12} md={4}>
                      <Card className={classes.cardWrap}>
                        <CardBody style={{display: "flex", alignContent: "space-between", flexDirection:"column"}}>
                          <div style={{display: "flex", justifyContent: "space-between"}}>
                            <h4 className={classes.cardTitle}>{t('Vault-Pending')}</h4>
                            <h5>{byDecimals(pool.claimPendingBalance).toFormat(4)} {pool.earnedToken}</h5>
                          </div>
                          <div style={{height:"43px"}}></div>
                          <p>{t('Vault-PendingDescription')}<br/>{t('Vault-PendingContent')}</p>
                        </CardBody>
                      </Card>
                    </GridItem>
                    <GridItem xs={6} sm={6}>
                      <Card>
                        <CardBody>
                          <h4 className={classes.cardTitle}>{t('Vault-Idle')}</h4>
                          <h5 className={classes.textCenter}>{byDecimals(pool.idle, pool.tokenDecimals).toFormat(4)} {pool.token}</h5>
                          {/* <Tooltip title={t('Vault-FarmButtonDescription')}  aria-label="add"> */}
                            <Button color="primary" round block
                              onClick={onFarm.bind(this, pool, index)} 
                              // disabled
                              disabled
                            >
                              {fetchFarmPending[index]?`${t('Vault-FarmING')}`:`${t('Vault-FarmButton')}`}
                            </Button>
                          {/* </Tooltip> */}
                        </CardBody>
                      </Card>
                    </GridItem>
                    <GridItem xs={6} sm={6}>
                      <Card>
                        <CardBody>
                          <h4 className={classes.cardTitle}>{t('Vault-Yield')}</h4>
                          <h5 className={classes.textCenter}>{byDecimals(pool.yield).toFormat(4)} {pool.earnedToken}</h5>
                          {/* <Tooltip title={t('Vault-HarvestButtonDescription')} aria-label="add"> */}
                            <Button color="primary" round block
                              // disabled 
                              onClick={onHarvest.bind(this, pool, index)}
                              disabled={fetchHarvestPending[index]}
                            >
                            {fetchHarvestPending[index]?`${t('Vault-HarvestING')}`:`${t('Vault-HarvestButton')}`}
                            </Button>
                          {/* </Tooltip> */}
                        </CardBody>
                      </Card>
                    </GridItem>
                  </GridContainer>
                </GridItem>
              </AccordionDetails>
            </Accordion>
          )
        })}
      </GridItem>
    </GridContainer>
  )
}
