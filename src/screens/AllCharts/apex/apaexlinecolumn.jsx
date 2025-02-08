import React from 'react'
import ReactApexChart from 'react-apexcharts'
import getChartColorsArray from '../../../components/Common/ChartsDynamicColor'

const Apaexlinecolumn = ({ dataColors, steps }) => {
  const apaexlineColumnColors = getChartColorsArray(dataColors)
  const series = [
    {
      name: 'Indicação',
      data: [46, 57, 59, 54, 62, 58, 64, 60],
    },
    {
      name: 'Lista',
      data: [74, 83, 102, 97, 86, 106, 93, 114],
    },
    {
      name: 'Linkedin',
      data: [74, 83, 102, 97, 86, 106, 93, 114],
    },
    {
      name: 'Outros',
      data: [74, 83, 102, 97, 86, 106, 93, 114],
    },
  ]
  const options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '45%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },

    colors: apaexlineColumnColors,
    xaxis: {
      categories: steps ? steps.map((i) => i.name) : [],
    },
    yaxis: {
      title: {
        text: 'Total',
      },
    },
    grid: {
      borderColor: '#f1f1f1',
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val
        },
      },
    },
  }

  return (
    <ReactApexChart options={options} series={series} type="bar" height={350} />
  )
}

export default Apaexlinecolumn
