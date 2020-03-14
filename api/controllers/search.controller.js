import User from '../models/user'
import validate from '../utils/validate'



class SearchController {
  constructor(searchService) {
    this.searchService = searchService
  }

  // async searchTeam(req, res) {

  //   const name = req.query.searchitem

  //   try {
  //     const searchResult = await this.searchService.searchTeam(name)
  //     if(searchResult) {
  //       return res.status(200).json({
  //         status: 200,
  //         data: searchResult
  //       })
  //     }
  //   } catch(error) {
  //     return res.status(500).json({
  //       status: 500,
  //       error: error.message
  //     })
  //   }
  // }

  async searchFixture(req, res) {

    // const errors = validate.searchValidate(req)
    // if (errors.length > 0) {
    //   return res.status(400).json({
    //     status: 400,
    //     errors: errors
    //   })
    // }

    const { home, away, matchday, matchtime } = req.query

    const searchTerm = {}
    if(home !== undefined){
      searchTerm.home = home
    }
    if(away !== undefined){
      searchTerm.away = away
    }
    if(matchday !== undefined){
      searchTerm.matchday = matchday
    }
    if(matchtime !== undefined){
      searchTerm.matchtime = matchtime
    }

    try {
      const searchResult = await this.searchService.searchFixture(searchTerm)
      if(searchResult) {
        return res.status(200).json({
          status: 200,
          data: searchResult
        })
      }
    } catch(error) {
      return res.status(500).json({
        status: 500,
        error: error.message
      })
    }
  }

}

export default SearchController