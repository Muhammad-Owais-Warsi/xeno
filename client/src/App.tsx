import { useState } from 'react'
import type { ProcessingResult, PageState } from './types'
import UploadPage from './components/UploadPage'
import ResultPage from './components/ResultPage'
import './App.css'

function App() {
  const [page, setPage] = useState<PageState>('upload')
  const [result, setResult] = useState<ProcessingResult | null>(null)

  const handleComplete = (processingResult: ProcessingResult) => {
    setResult(processingResult)
    setPage('result')
  }

  const handleReset = () => {
    setResult(null)
    setPage('upload')
  }

  return (
    <div className="app">
      {page === 'upload' && <UploadPage onComplete={handleComplete} />}
      {page === 'result' && result && <ResultPage result={result} onReset={handleReset} />}
    </div>
  )
}

export default App
