import React, { useState, useEffect } from 'react'
import mockUser from './mockData.js/mockUser'
import mockRepos from './mockData.js/mockRepos'
import mockFollowers from './mockData.js/mockFollowers'
import axios from 'axios'

const rootUrl = 'https://api.github.com'

const GithubContext = React.createContext()
const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser)
  const [repos, setRepos] = useState(mockRepos)
  const [followers, setFollowers] = useState(mockFollowers)
  const [requests, setRequests] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState({ flag: '', msg: '' })

  // const getResults = () =>
  //   axios(`${rootUrl}/rate_limit`)
  //     .then((results) =>
  //     setRequests(results.data.rate.remaining))
  //     .catch((error) => {
  //       console.log(error)
  //     })
  const getResults = () =>
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let {
          rate: { remaining },
        } = data
        if (remaining === 0) {
          toggleError(true, 'Sorry, You Have Exceeded Your Hourly Rate Limit!')
        }
        setRequests(remaining)
      })
      .catch((error) => {
        console.log(error)
      })

  const toggleError = (flag = false, msg = '') => {
    setError({ flag, msg })
  }

  // const getInfo = async (user) => {
  //   toggleError()
  //   setIsLoading(true)
  //   await axios(`${rootUrl}/users/${user}`)
  //     .then((results) => {
  //       console.log(results.data.login)
  //       results.data && setGithubUser(results.data)
  //       const { repos_url } = results.data
  //       Promise.allSettled([
  //         axios(`${rootUrl}/users/${user}/followers?per_page=100`),
  //         axios(`${repos_url}?per_page=100`),
  //       ])
  //         .then((response) => {
  //           const [followers, repos] = response
  //           console.log(followers, repos)

  //           response.map((risposta) => {
  //             const check = 'fulfilled'
  //             if (risposta.status === check) {
  //               setFollowers(followers.value.data)
  //               setRepos(repos.value.data)
  //               setIsLoading(false)
  //             } else {
  //               toggleError(true, 'there is no user with such name')
  //               setIsLoading(false)
  //             }
  //           })
  //         })
  //         .catch((error) => {
  //           console.log(error)
  //         })
  //     })
  //     .catch((error) => console.log(error))
  // }

  const getInfo = async (user) => {
    toggleError()
    setIsLoading(true)
    const results = await axios(`${rootUrl}/users/${user}`).catch((error) => {
      console.log(error)
    })
    if (results) {
      setGithubUser(results.data)
      const { login, followers_url } = results.data
      console.log(login)
      await Promise.allSettled([
        axios(`${followers_url}?per_page=100`),
        axios(
          `https://api.github.com/users/${login}/repos?per_page=100?per_page=100`
        ),
      ]).then((response) => {
        console.log(response)
        const [followers, repos] = response
        const check = 'fulfilled'
        if (followers.status === check) {
          setFollowers(followers.value.data)
        }
        if (repos.status === check) {
          setRepos(repos.value.data)
        }
      })
    } else {
      toggleError(true, 'there is no user with such name')
      console.log('eccolo')
    }

    setIsLoading(false)
    getResults()
  }

  useEffect(() => {
    getResults()
  }, [])

  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        requests,
        isLoading,
        error,
        getInfo,
      }}
    >
      {children}
    </GithubContext.Provider>
  )
}
export { GithubContext, GithubProvider }

// - [Root Endpoint](https://api.github.com)
// - [Get User](https://api.github.com/users/wesbos)
// - [Repos](https://api.github.com/users/john-smilga/repos?per_page=100)
// - [Followers](https://api.github.com/users/john-smilga/followers)
// - [Rate Limit](https://api.github.com/rate_limit)
