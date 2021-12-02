import React, { useEffect, useState } from 'react'
import "./index.css";
import "../../node_modules/bootstrap/dist/css/bootstrap-grid.min.css";
import axios from 'axios';
import Loader from 'components/Loader';
import e from 'cors';
import { getNumberFormated } from 'CommanFunctions';
import { getNumberFormatedonly } from 'CommanFunctions';
import { useSelector } from 'react-redux';


function Predict() {
    const [compnyList, setcompnyList] = useState([])
    const [predictedPrice, setpredictedPrice] = useState(0)
    const [companies, setcompanies] = useState([])
    const [selectedCompanyInfo, setselectedCompanyInfo] = useState({})
    const [loading, setloading] = useState(false)
    const [searchedstockname, setsearchedstockname] = useState("")

    const searchStock = (e) => {
        setpredictedPrice(0)
        let name = e.target.value
        name = String(name).toLocaleLowerCase()
        setsearchedstockname(name)
        setselectedCompanyInfo({})
        if (name.length > 0) {
            fetch(`/get_ticker?query=${name}&exchange=NSI`).then((res) => {
                if (res.status == 200) {
                    return res.json()
                }
            })
                .then(data => setcompnyList(data.data)).catch(e => console.log(e))
            
        }
        else {
            setcompnyList([])
        }
    }
    const userData = useSelector(state => state.userData)
    const predict = (symbol) => {
        setloading(true)
        let c = Object.keys(companies);
        if (c?.includes(symbol)) {
            setpredictedPrice(companies[symbol])
            setcompnyList([])
        }
        else {
            fetch(`/predict?ticker=${symbol}`).then((res) => {
                if (res.status == 200) {
                    return res.json()
                }
            }).then(data => {
                setpredictedPrice(data.data)
                let obj = {}
                obj[symbol] = data.data
                let a = companies
                a.push(obj)
                setcompanies(a)
                setcompnyList([])
                setloading(false)
            }).catch(e => {
                console.log(e)
                setloading(false)
            }
            )
        }
        fetch(`/fetch_details?ticker=${symbol}`).then((res) => {
            if (res.status == 200) {
                return res.json()
            }
        }).then(data => {
            setselectedCompanyInfo(data.INFO)
        }).catch(e => console.log(e))
    }

    return (
        <>
            {Object.keys(userData).length > 0 ?  <>
            {
            loading && <Loader />
            }
            <div className="stock-name container-sm">
                <div className="form-group stock-name ">
                    <label>Search for the stock here</label>
                    <input type="text" className="form-control" placeholder="Enter Stock Name" name="tickername" onChange={searchStock} value={searchedstockname} />
                </div>
                {
                    searchedstockname.length > 0 && Object.keys(selectedCompanyInfo).length === 0 &&
                <div className="stock-dropdown">
                    {(compnyList && compnyList?.length > 0)  ?
                        compnyList?.map(item => <><div style={{cursor:"pointer", }} className="stock-dropdown-item" onClick={() =>predict(item.symbol)}><span style={{color:"#1DC7EA"}} title="Click to predict">{item?.symbol } </span> : {item?.name}</div></>)
                        : <><span className="no-data-found">NO DATA FOUND &#x1F610;</span></>
                    }
                </div>
                }
                {predictedPrice > 0 &&
                    <div className="mine-predictions">
                    <p style={{ fontWeight: "bolder", color: 'grey', fontSize: 18, marginTop: 20 }}><strong>Mine Prediction for <u>{ selectedCompanyInfo['longName']}</u></strong><strong><span style={{ fontWeight: "bolder", color: 'grey', fontSize: 18, marginTop: 20 }}> is: {predictedPrice < selectedCompanyInfo['currentPrice'] ? <span style={{color:"red"}}>{parseFloat(predictedPrice).toFixed(2)}</span>: <span style={{color:"green"}}>{parseFloat(predictedPrice).toFixed(2)}</span>}</span></strong></p>
                        {predictedPrice < selectedCompanyInfo['currentPrice'] ? <p style={{ fontWeight: "bolder", color: 'grey', fontSize: 18, marginTop: 20 }}>Our Suggestion is: <span style={{ color: "red", fontWeight: "bold" }} >SELL</span></p> : <p style={{ fontWeight: "bolder", color: 'grey', fontSize: 18, marginTop: 20 }}>Our Suggestion is: <span style={{ color: "green", fontWeight: "bold" }} >BUY</span></p>}
                    
                    </div>
                }
                {Object.keys(selectedCompanyInfo).length > 0 &&
                    <div className="company-details">
                        <div className="company-details-table">

                            <p style={{ fontWeight: "bolder", color: 'grey', fontSize: 18 }}><strong>Overview</strong></p>
                            <div className="table-row">
                                <div className="row-title">Current Price</div>
                                <div className="row-details">{getNumberFormated(selectedCompanyInfo['currentPrice'], 2)}</div>
                            </div>
                            <div className="table-row">
                                <div className="row-title">Day High</div>
                                <div className="row-details">{getNumberFormated(selectedCompanyInfo['dayHigh'], 2)}</div>
                            </div>
                            <div className="table-row">
                                <div className="row-title">Day Low</div>
                                <div className="row-details">{getNumberFormated(selectedCompanyInfo['dayLow'], 2)}</div>
                            </div>
                            <div className="table-row">
                                <div className="row-title">Open</div>
                                <div className="row-details">{getNumberFormated(selectedCompanyInfo['open'], 2)}</div>
                            </div>
                            <div className="table-row">
                                <div className="row-title">Previous Close</div>
                                <div className="row-details">{getNumberFormated(selectedCompanyInfo['previousClose'], 2)}</div>
                            </div>
                            <div className="table-row">
                                <div className="row-title">Volume</div>
                                <div className="row-details">{getNumberFormatedonly(selectedCompanyInfo['volume'])}</div>
                            </div>
                            <div className="table-row">
                                <div className="row-title">52 Week High</div>
                                <div className="row-details">{getNumberFormated(selectedCompanyInfo['fiftyTwoWeekHigh'], 2)}</div>
                            </div>
                            <div className="table-row">
                                <div className="row-title">52 Week Low</div>
                                <div className="row-details">{getNumberFormated(selectedCompanyInfo['fiftyTwoWeekLow'], 2)}</div>
                            </div>
                    
                            <hr />
                            <p style={{ fontWeight: "bolder", color: 'grey', fontSize: 18, marginTop: 20 }}><strong>Company Details</strong></p>
                            <div className="table-row">
                                <div className="row-title">Name</div>
                                <div className="row-details">{selectedCompanyInfo['longName']}</div>
                            </div>
                            <div className="table-row">
                                <div className="row-title">Sector</div>
                                <div className="row-details">{selectedCompanyInfo['sector']}</div>
                            </div>
                            <div className="table-row">
                                <div className="row-title">Website</div>
                                <div className="row-details"><a href={selectedCompanyInfo['website']} target="_blank">{selectedCompanyInfo['website']}</a></div>
                            </div>
                            <div className="table-row">
                                <div className="row-title">Help Line</div>
                                <div className="row-details"><a href={`tel: ${selectedCompanyInfo['phone']}`} target="_blank">{selectedCompanyInfo['phone']}</a></div>
                            </div>
                            <div className="table-row">
                                <div className="row-title">Address</div>
                                <div className="row-details">{`${selectedCompanyInfo['address1']}, ${selectedCompanyInfo['address2']}, ${selectedCompanyInfo['city']}, ${selectedCompanyInfo['country']} ${selectedCompanyInfo['zip']} `}</div>
                            </div>

                            <hr />
                            <p style={{ fontWeight: "bolder", color: 'grey', fontSize: 18, marginTop: 20 }}><strong>Company Finances</strong></p>
                            <div className="table-row">
                                <div className="row-title">Stock Price</div>
                                <div className="row-details">{getNumberFormated(selectedCompanyInfo['currentPrice'], 2)} </div>
                            </div>
                            <div className="table-row">
                                <div className="row-title">Market cap</div>
                                <div className="row-details">{getNumberFormated(selectedCompanyInfo['marketCap'])} </div>
                            </div>
                            <div className="table-row">
                                <div className="row-title">Total Cash</div>
                                <div className="row-details">{getNumberFormated(selectedCompanyInfo['totalCash'])} </div>
                            </div>
                            <div className="table-row">
                                <div className="row-title">Total Revenue</div>
                                <div className="row-details">{getNumberFormated(selectedCompanyInfo['totalRevenue'])} </div>
                            </div>
                            <div className="table-row">
                                <div className="row-title">Total Debt</div>
                                <div className="row-details">{getNumberFormated(selectedCompanyInfo['totalDebt'])} </div>
                            </div>
                            <div className="table-row">
                                <div className="row-title"> Cash per share</div>
                                <div className="row-details">{getNumberFormated(selectedCompanyInfo['totalCashPerShare'], 2)} </div>
                            </div>
                            <div className="table-row">
                                <div className="row-title">Revenue per Share</div>
                                <div className="row-details">{getNumberFormated(selectedCompanyInfo['revenuePerShare'], 2)} </div>
                            </div>
                            <div className="table-row">
                                <div className="row-title">Operating Cash Flow</div>
                                <div className="row-details">{getNumberFormated(selectedCompanyInfo['operatingCashflow'])} </div>
                            </div>
                            <div className="table-row">
                                <div className="row-title">P/E</div>
                                <div className="row-details">{Number(selectedCompanyInfo['trailingPE']).toFixed(2)} </div>
                            </div>
                            <div className="table-row">
                                <div className="row-title">P/B</div>
                                <div className="row-details">{Number(selectedCompanyInfo['priceToBook']).toFixed(2)} </div>
                            </div>
                            <div className="table-row">
                                <div className="row-title">ROE (return On Equaty)</div>
                                <div className="row-details">{Number(Number(selectedCompanyInfo['returnOnEquity'])*100).toFixed(2)} %</div>
                            </div>
                            <div className="table-row">
                                <div className="row-title">ROA (return On Assets)</div>
                                <div className="row-details">{Number(Number(selectedCompanyInfo['returnOnAssets'])*100).toFixed(2)} % </div>
                            </div>
                            <div className="table-row">
                                <div className="row-title">Dividend Yield</div>
                            <div className="row-details">{Number(Number(selectedCompanyInfo['trailingAnnualDividendYield']) * 100).toFixed(2)}% </div>
                            </div>
                            <div className="table-row">
                                <div className="row-title">EPS</div>
                                <div className="row-details">{getNumberFormated(selectedCompanyInfo['trailingEps'],2)} </div>
                            </div>
                            <div className="table-row">
                                <div className="row-title">Book value</div>
                                <div className="row-details">{getNumberFormated(selectedCompanyInfo['bookValue'],2)} </div>
                            </div>
                            <div className="table-row">
                                <div className="row-title">Promoter Holding </div>
                                <div className="row-details">{Number(Number(selectedCompanyInfo['heldPercentInsiders'])*100).toFixed(2)} %</div>
                            </div>
                            <hr />
                            <p style={{ fontWeight: "bolder", color: 'grey', fontSize: 18, marginTop: 20 }}><strong>Other Details</strong></p>
                            <div className="table-row">
                                <div className="row-title"><img src={selectedCompanyInfo['logo_url']} /></div>
                                <div className="row-details">{selectedCompanyInfo['longBusinessSummary']}</div>
                            </div>
                            <div className="table-row">
                                <div className="row-title">No. of employees </div>
                                <div className="row-details">{getNumberFormatedonly(selectedCompanyInfo['fullTimeEmployees'])} </div>
                            </div>
                            <div className="table-row">
                                <div className="row-title">Industry</div>
                                <div className="row-details">{selectedCompanyInfo['industry']} </div>
                            </div>
                            {/* {
                            Object.keys(selectedCompanyInfo).map(element => 
                                <div className="table-row">
                                    <div className="row-title">{element}</div>
                                    <div className="row-details">{selectedCompanyInfo[element] }</div>
                                </div>
                                
                            )
                        } */}
                        </div>

                    </div>
                }
            
                </div>
            </> : <div className="please-login">
                    
                    <p>
                    <i class="fa fa-lock" style={{fontSize:48, marginLeft:"40%"} }></i><br/>LOGIN TO CONTINUE</p></div>
}
        </>
    )
}

export default Predict
