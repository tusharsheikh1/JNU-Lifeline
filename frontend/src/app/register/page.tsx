// app/register/page.tsx
'use client'
import { useForm } from 'react-hook-form'
import { useState } from 'react'

// Bangladesh divisions and major districts (simplified for now)
const BANGLADESH_LOCATIONS = {
  'Dhaka': ['Dhaka', 'Faridpur', 'Gazipur', 'Gopalganj', 'Kishoreganj', 'Madaripur', 'Manikganj', 'Munshiganj', 'Narayanganj', 'Narsingdi', 'Rajbari', 'Shariatpur', 'Tangail'],
  'Chattogram': ['Chattogram', 'Bandarban', 'Brahmanbaria', 'Chandpur', 'Cumilla', 'Cox\'s Bazar', 'Feni', 'Khagrachhari', 'Lakshmipur', 'Noakhali', 'Rangamati'],
  'Rajshahi': ['Rajshahi', 'Bogura', 'Joypurhat', 'Naogaon', 'Natore', 'Chapainawabganj', 'Pabna', 'Sirajganj'],
  'Khulna': ['Khulna', 'Bagerhat', 'Chuadanga', 'Jessore', 'Jhenaidah', 'Kushtia', 'Magura', 'Meherpur', 'Narail', 'Satkhira'],
  'Barishal': ['Barishal', 'Barguna', 'Bhola', 'Jhalokati', 'Patuakhali', 'Pirojpur'],
  'Sylhet': ['Sylhet', 'Habiganj', 'Moulvibazar', 'Sunamganj'],
  'Rangpur': ['Rangpur', 'Dinajpur', 'Gaibandha', 'Kurigram', 'Lalmonirhat', 'Nilphamari', 'Panchagarh', 'Thakurgaon'],
  'Mymensingh': ['Mymensingh', 'Jamalpur', 'Netrokona', 'Sherpur']
}

type FormData = {
  name: string
  email: string
  phone: string
  age: number
  group: string
  division: string
  district: string
  area: string
  lastDonationDate?: string
  notes?: string
}

export default function RegisterPage() {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting }, reset } = useForm<FormData>()
  const [selectedDivision, setSelectedDivision] = useState('')
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const watchDivision = watch('division')

  async function onSubmit(values: FormData) {
    setSubmitStatus('idle')
    setErrorMessage('')
    
    try {
      // Format data to match backend expectations
      const formattedData = {
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        phone: values.phone.startsWith('+88') ? values.phone : `+88${values.phone}`,
        age: parseInt(values.age.toString()),
        bloodGroup: values.group,
        location: {
          division: values.division,
          district: values.district,
          thana: values.area.trim()
        },
        lastDonationDate: values.lastDonationDate || null,
        notes: values.notes?.trim() || ''
      }

      const response = await fetch('/api/donors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData)
      })

      const result = await response.json()

      if (response.ok && result.status === 'success') {
        setSubmitStatus('success')
        reset()
        setSelectedDivision('')
      } else {
        setSubmitStatus('error')
        setErrorMessage(result.message || 'Registration failed. Please try again.')
      }
    } catch (error) {
      setSubmitStatus('error')
      setErrorMessage('Network error. Please check your connection and try again.')
      console.error('Registration error:', error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Register as a Blood Donor</h1>
        <p className="text-gray-600 mt-2">Join our network and help save lives</p>
      </div>

      {submitStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center">
            <div className="text-green-600 text-xl mr-3">✅</div>
            <div>
              <h3 className="font-semibold text-green-800">Registration Successful!</h3>
              <p className="text-green-700 text-sm">Thank you for joining our blood donor network.</p>
            </div>
          </div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center">
            <div className="text-red-600 text-xl mr-3">❌</div>
            <div>
              <h3 className="font-semibold text-red-800">Registration Failed</h3>
              <p className="text-red-700 text-sm">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input 
              {...register('name', { 
                required: 'Name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' }
              })}
              className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Enter your full name"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
            <input 
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: { 
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="your.email@example.com"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input 
                {...register('phone', { 
                  required: 'Phone number is required',
                  pattern: {
                    value: /^(\+88)?01[3-9]\d{8}$/,
                    message: 'Invalid Bangladesh phone number'
                  }
                })}
                className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="01712345678"
              />
              {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
              <input 
                type="number"
                {...register('age', { 
                  required: 'Age is required',
                  min: { value: 18, message: 'Must be at least 18 years old' },
                  max: { value: 65, message: 'Must be under 65 years old' }
                })}
                className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="25"
              />
              {errors.age && <p className="text-red-600 text-sm mt-1">{errors.age.message}</p>}
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Medical Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group *</label>
            <select 
              {...register('group', { required: 'Blood group is required' })}
              className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Select your blood group</option>
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
            {errors.group && <p className="text-red-600 text-sm mt-1">{errors.group.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Donation Date (Optional)</label>
            <input 
              type="date"
              {...register('lastDonationDate')}
              className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              max={new Date().toISOString().split('T')[0]}
            />
            <p className="text-gray-500 text-sm mt-1">Leave blank if you've never donated before</p>
          </div>
        </div>

        {/* Location Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Location Information</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Division *</label>
              <select 
                {...register('division', { required: 'Division is required' })}
                onChange={(e) => setSelectedDivision(e.target.value)}
                className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Select Division</option>
                {Object.keys(BANGLADESH_LOCATIONS).map(division => (
                  <option key={division} value={division}>{division}</option>
                ))}
              </select>
              {errors.division && <p className="text-red-600 text-sm mt-1">{errors.division.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
              <select 
                {...register('district', { required: 'District is required' })}
                disabled={!watchDivision}
                className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
              >
                <option value="">Select District</option>
                {watchDivision && BANGLADESH_LOCATIONS[watchDivision as keyof typeof BANGLADESH_LOCATIONS]?.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
              {errors.district && <p className="text-red-600 text-sm mt-1">{errors.district.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thana/Upazila/Area *</label>
            <input 
              {...register('area', { 
                required: 'Area is required',
                minLength: { value: 2, message: 'Area must be at least 2 characters' }
              })}
              className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="e.g., Dhanmondi, Wari, Kotwali"
            />
            {errors.area && <p className="text-red-600 text-sm mt-1">{errors.area.message}</p>}
          </div>
        </div>

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (Optional)</label>
          <textarea 
            {...register('notes')}
            rows={3}
            className="w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="Any additional information you'd like to share..."
          />
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-red-600 text-white rounded-xl px-6 py-3 font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Registering...' : 'Register as Donor'}
        </button>
      </form>

      <div className="text-center text-sm text-gray-500">
        <p>By registering, you agree to be contacted by people in need of blood donation.</p>
      </div>
    </div>
  )
}