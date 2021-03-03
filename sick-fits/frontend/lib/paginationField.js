import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, //tells apollo we will take care of everything
    read(existing = [], { args, cache }) {
      const { skip, first } = args;
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);

      // first thing this does it asks the read function for the items
      const items = existing.slice(skip, skip + first).filter((x) => x);
      // if there are items, and there aren't enough items to satisfy how many were requested, AND we are on the last page, then just send it
      if (items.length && items.length !== first && page === pages) {
        return items;
      }
      if (items.length !== first) {
        // we don't have any items we must go to the network to fetch them
        return false;
      }

      //if there are items just return them from the cache and we don't need the network
      if (items.length) {
        return items;
      }

      return false; //fallback to network

      //we can either do one of two things: 
      //first we can return the items because they are already in the cache
      //or we can return false from here, (network request)
    },
    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      //this runs when the apollo client comes back from the network with our product
      const merged = existing ? existing.slice(0) : [];
      for(let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      
      return merged;
    }
  }
}