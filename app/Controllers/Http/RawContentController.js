'use strict'
const RawContent = use('App/Models/RawContent')

/**
 * Resourceful controller for interacting with rawcontents
 */
class RawContentController {
  /**
   * Show a list of all rawcontents.
   * GET rawcontents
   */
  async index ({ request, response, view }) {
    const rawContent = await RawContent.query().fetch()
    return rawContent
  }

  /**
   * Render a form to be used for creating a new rawcontent.
   * GET rawcontents/create
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new rawcontent.
   * POST rawcontents
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single rawcontent.
   * GET rawcontents/:id
   */
  async show ({ params, request, response, view }) {
    const rawContent = await RawContent.find(params.id)
    return rawContent
  }

  /**
   * Render a form to update an existing rawcontent.
   * GET rawcontents/:id/edit
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update rawcontent details.
   * PUT or PATCH rawcontents/:id
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a rawcontent with id.
   * DELETE rawcontents/:id
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = RawContentController
