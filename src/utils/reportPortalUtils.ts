import axios from "axios";

export class reportportalHelper {
  async getReportPortalLatestLaunch() {
    const response = await axios.get(
      `http://localhost:8081/api/v1/report_portal/launch/latest`,
      {
        headers: {
          Authorization: `bearer test_CAPxfOabTbi-G8ryGZZC-3IDWMyBthin8BpCY55TWpslHelFBt2TuyYvu2yrZPrC`,
        },
      },
    );
    return response.data;
  }
}
