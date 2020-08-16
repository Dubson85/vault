import React, { useState, useEffect } from 'react';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import Button from "components/CustomButtons/Button.js";
// sections for this section
import SectionOpenedPool from "./SectionOpenedPool";
//  hooks
import { useAccount } from '../../common/redux/hooks';
import { useFetchBalances, useFetchPoolBalances } from '../redux/hooks';

import sectionPoolsStyle from "../jss/sections/sectionPoolsStyle";

const useStyles = makeStyles(sectionPoolsStyle);

export default function SectionPools() {
  const { account, provider } = useAccount();
  const { pools, fetchPoolBalances } = useFetchPoolBalances();
  const { tokens, fetchBalances } = useFetchBalances();
  const [ openedCardList, setOpenCardList ] = useState([]);
  const classes = useStyles();

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

  useEffect(() => {
    fetchBalances({account, provider, tokens});
  }, [account, provider,fetchBalances]);

  useEffect(() => {
    fetchPoolBalances({account, provider, pools});
  }, [account, provider,fetchPoolBalances]);

  return pools.map((pool) => {
    return (
      openedCardList.includes(pool.id) ?
        <SectionOpenedPool closeCard={openCard.bind(this, pool.id)} pool={pool} key={pool.id}/> :
        <div style={{width: '100%'}} key={pool.id}>
          <Card key={pool.id}>
            <CardBody style={{ 
              display: "flex",
              justifyContent : "space-around",
              alignItems : "center",
              alignContent: "space-around"
            }}>
              <div>logo</div>
              <div>{tokens[pool.token].tokenBalance}</div>
              <div>
                <h5>{pool.token}</h5>
                <h6>Balance</h6>
              </div>
              <div>
                <h5>{pool.stakedBalance}</h5>
                <h6>Deposited { pool.token }</h6>
              </div>
              <div>
                <h5>{pool.claimAbleBalance}</h5>
                <h6>Earned { pool.earnedToken }</h6>
              </div>
              <div>
                <h5>未知</h5>
                <h6>Pending { pool.earnedToken }</h6>
              </div>
              <div><Button color="primary" onClick={openCard.bind(this, pool.id)}>展开/关闭</Button></div>
            </CardBody>
          </Card>
        </div>
      
    )
  })
}
