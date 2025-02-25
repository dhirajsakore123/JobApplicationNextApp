"use client"

import JobForm from '@/components/JobForm'
import withAuth from '@/components/withAuth'
import React from 'react'

const createJob = () => {
  return (
    <div className=' bg-white'>
        <JobForm/>
    </div>
  )
}

export default withAuth(createJob)
