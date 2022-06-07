// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator'

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type'

// We import object and document schemas
import blockContent from './blockContent'
import category from './category'
import post from './post'
// import author from './author'
import homepage from './homepage'
import about from './about'
import help from './help'
import faq from './faq'
import salon from './salon'
import landing from './landing'
import reviews from './reviews'
import landingSection from './landingSection'

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: 'default',
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    // The following are document types which will appear
    // in the studio.
    homepage,
    about,
    landing,
    salon,
    post,
    // author,
    category,
    help,
    faq,
    reviews,
    landingSection,
    // When added to this list, object types can be used as
    // { type: 'typename' } in other document schemas
    blockContent,
  ]),
})
