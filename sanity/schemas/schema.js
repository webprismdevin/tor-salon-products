// First, we must import the schema creator
import createSchema from 'part:@sanity/base/schema-creator'

// Then import schema types from any plugins that might expose them
import schemaTypes from 'all:part:@sanity/base/schema-type'

// We import object and document schemas
import blockContent from './objects/blockContent'
import category from './documents/category'
import post from './documents/post'
// import author from './author'
import homepage from './singletons/homepage'
import about from './singletons/about'
import help from './singletons/help'
import faq from './documents/faq'
import salon from './documents/salon'
import landing from './old/pages/landing'
import reviews from './documents/review'
import landingSection from './old/parts/landingSection'
import siteSettings from './siteSettings'
import wholesale from './singletons/wholesale'
import tryTor from './singletons/tryTor'
import offer from './documents/offer'
import product from './documents/product'

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
  // We name our schema
  name: 'default',
  // Then proceed to concatenate our document type
  // to the ones provided by any plugins that are installed
  types: schemaTypes.concat([
    // The following are document types which will appear
    // in the studio.
    siteSettings,
    offer,
    homepage,
    about,
    wholesale,
    tryTor,
    salon,
    post,
    category,
    help,
    faq,
    reviews,
    product,
    // When added to this list, object types can be used as
    // { type: 'typename' } in other document schemas
    blockContent,
  ]),
})
