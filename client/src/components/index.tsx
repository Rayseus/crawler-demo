import React, { useState } from "react";
import fetch from "../util/fetch";
import { Button, Col, Row, Statistic, Card, Empty } from "antd";
import "./style.css";
// format字段名为中文
import formatMessage from "../util/format";

export default function Home() {
  const [data, setData] = useState([]);

  // 从服务端获取爬取的数据, 这里用了proxy
  const fetchData = () => {
    fetch.get("/showData").then((res: any) => {
      if (res && JSON.stringify(res) !== "{}") {
        setData(res);
      }
    });
  };

  const handleCrawlClick = () => {
    fetchData();
  };

  return (
    <Card className="home-page" title='巨量直播数据' bordered={false} style={{boxShadow: 'none'}}>
      {data.length === 0 ? <Empty /> : Object.entries(data).map(([key, value]: any) => (
        <Card className="data-card" title={formatMessage[key]} bordered={false}>
          <Row gutter={16}>
            {Object.entries(value.overview).map(([key, value]: any) => (
              <Col span={8}>
                <Statistic title={formatMessage[key]} value={value} />
              </Col>
            ))}
          </Row>
          <Row gutter={16}>
            {value.list ? (
              <Col span={16}>
                <Statistic
                  className="data-stat"
                  title={formatMessage[key]}
                  value={
                    value.length === 0
                      ? value.map((item: any) => JSON.stringify(item))
                      : "-"
                  }
                />
              </Col>
            ) : (
              <></>
            )}
          </Row>
        </Card>
      ))}
      <div className="crawler-btn">
        <Button className="btn" onClick={handleCrawlClick}>
          Crawl
        </Button>
      </div>
    </Card>
  );
}
