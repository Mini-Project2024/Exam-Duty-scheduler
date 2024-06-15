import React from 'react'

const ExchangeFaculty = () => {
  return (
    <div>
       <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form class="space-y-6" action="#" method="POST">
      <div>
        <label for="" class="block text-sm font-medium leading-6 text-gray-900">which date duty to be changed:</label>
        <div class="mt-2">
          <input type="date" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
        </div>
      </div>
      <div>
          <label for="text" class="block text-sm font-medium leading-6 text-gray-900">Choose the session</label>
          <div class="mt-2">
          <select required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            <option value="">Morning</option>
            
            <option value="">Evening</option></select>
        </div>
        </div>
        <div>
          <label for="text" class="block text-sm font-medium leading-6 text-gray-900">Exchanging Faculty name:</label>
          <div class="mt-2">
          <select required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            <option value="">names</option>
            <option value="">names</option>
            <option value="">names</option></select>
        </div>
        </div>
       
        <div>
        <label for="" class="block text-sm font-medium leading-6 text-gray-900">changing date</label>
        <div class="mt-2">
          <input type="date" required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
        </div>
      </div>
      <div>
          <label for="text" class="block text-sm font-medium leading-6 text-gray-900">changing session</label>
          <div class="mt-2">
          <select required class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
            <option value="">Morning</option>
            
            <option value="">Evening</option></select>
        </div>
        </div>
      <div>
        <button type="submit" class="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Submit</button>
      </div>
    </form></div>
      <form action=""  className='min-h-screen flex flex-col gap-4 items-center justify-center p-5 bg-gray-100'>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <label htmlFor="">which date duty to be changed:</label>
        <input type="date" name="" id="" className='gap:10px'/></div>
        <label htmlFor=""></label>
        <label htmlFor="">name of the faculty</label>
        <input type="text" />
        <label htmlFor="">choose session</label>
        <select name="" id="">
          <option value="morning">morning</option>
          <option value="afternoon">afternoon</option>
        </select>
        <label htmlFor="">to which date</label>
          <select name="" id="">
            <option value=""></option>
          </select>
      </form>
    </div>
  )
}

export default ExchangeFaculty