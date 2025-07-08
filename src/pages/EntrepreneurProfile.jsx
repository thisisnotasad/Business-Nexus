import React from 'react'

const EntrepreneurProfile = () => {
  return (
    <>
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>

    <div className='bg-white/90 p-6 rounded-2xl shadow-xl w-full max-w-[90vw] sm:max-w-md mx-auto mt-10 border border-blue-100 backdrop-blur-sm'>

        <h1 className="text-2xl font-semibold text-gray-700">Entrepreneur Profile</h1>
        <p className="text-gray-600">This is the entrepreneur profile page where users can view and edit their profiles.</p>
        {/* Add profile functionality here */}
        <div className="mt-4">
            <input type="text" placeholder="Enter your name" className="border p-2 w-full mb-2" />
            <input type="email" placeholder="Enter your email" className="border p-2 w-full mb-2" />
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">Update Profile</button>
        </div>
    </div>
    </div>
      
    </>
  )
}

export default EntrepreneurProfile
