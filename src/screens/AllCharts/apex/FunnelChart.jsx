import React from 'react'
import ReactApexChart from 'react-apexcharts'

const FunnelChart = ({ steps }) => {
  const series = [
    {
      name: '',
      data: steps?.map((i) => i.count) ?? []
    },
  ]
  const options = {
    plotOptions: {
      bar: {
        borderRadius: 0,
        horizontal: true,
        barHeight: '80%',
        isFunnel: true,
        distributed: true,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opt) {
        return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val
      },
      dropShadow: {
        enabled: true,
      },
    },
    colors: steps?.map((i) => i.step.color) ?? [],
    title: {
      text: '',
      align: 'middle',
    },
    xaxis: {
      categories: steps
        ? steps.map((i) => (i.step.step ? i.step.step : ''))
        : [],
    },
    legend: {
      show: false,
    },
  }

  return steps ? (
    <ReactApexChart options={options} series={series} type="bar" height="390" />
  ) : (
    <></>
  )
}

export default FunnelChart
