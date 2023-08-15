import React from 'react'
import ThoroughPR from '../components/ThoroughPR';
import LeadTime from '../components/LeadTime';

function Metrics() {

  return (
    <div>
      <h1>Your Metrics</h1>
      {/* <ThoroughPR></ThoroughPR> */}
      
      {/* test purpose only */}
      <LeadTime data={{onwer : "kai2233", repo : "TicketWingMan_backend"}}></LeadTime>
    </div>
  )
}

export default Metrics;