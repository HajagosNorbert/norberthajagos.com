import sanityClient from '@sanity/client';

export default sanityClient({
  projectId: 'aty445sv', // you can find this in sanity.json
  dataset: 'norberthajagos', // or the name you chose in step 1
  useCdn: true, //
})