import React from 'react'
import styled from 'styled-components'
import { GithubContext } from '../context/context'
import { Pie3D, Column3D, Bar3D, Doughnut2D } from './Charts'
const Repos = () => {
  const { repos } = React.useContext(GithubContext)

  const chartData = [
    {
      label: 'HTML',
      value: '290',
    },
    {
      label: 'CSS',
      value: '260',
    },
    {
      label: 'JavaScript',
      value: '180',
    },
    {
      label: 'React',
      value: '190',
    },
  ]

  const { stars, forks } = repos.reduce(
    (total, acc) => {
      const { name, stargazers_count, forks } = acc
      total.stars[stargazers_count] = {
        label: name,
        value: stargazers_count,
      }
      total.forks[forks] = { label: name, value: forks }
      return total
    },
    { stars: {}, forks: {} }
  )

  const getStarsChart = Object.values(stars)
    .sort((a, b) => {
      return b.value - a.value
    })
    .slice(0, 5)

  const getForksChart = Object.values(forks)
    .sort((a, b) => {
      return b.value - a.value
    })
    .slice(0, 5)

  const languages = repos.reduce((total, acc) => {
    const { language, name, stargazers_count } = acc
    if (!language) {
      return total
    }

    if (!total[language]) {
      total[language] = { label: language, value: 1, stars: stargazers_count }
    }

    if (total[language]) {
      total[language] = {
        ...total[language],
        value: total[language].value + 1,
        stars: total[language].stars + stargazers_count,
      }
    }

    return total
  }, {})
  const getValues = Object.values(languages)
    .sort((a, b) => {
      return b.value - a.value
    })
    .slice(0, 5)

  const getStars = Object.values(languages)
    .map((item) => {
      return { ...item, value: item.stars }
    })
    .sort((a, b) => {
      return b.value - a.value
    })
    .slice(0, 5)

  return (
    <section className='section'>
      <Wrapper className='section-center'>
        <Pie3D data={getValues} />
        <Column3D data={getStarsChart} />
        <Doughnut2D data={getStars} />
        <Bar3D data={getForksChart} />
      </Wrapper>
    </section>
  )
}

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`

export default Repos
