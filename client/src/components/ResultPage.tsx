import type { ProcessingResult } from '../types'

interface ResultPageProps {
  result: ProcessingResult
  onReset: () => void
}

export default function ResultPage({ result, onReset }: ResultPageProps) {
  const { totalRows, validRows, invalidRows, cleanedFiles, errorFile, detectedFields } = result

  const validPercent = totalRows > 0 ? Math.round((validRows / totalRows) * 100) : 0
  const invalidPercent = totalRows > 0 ? Math.round((invalidRows / totalRows) * 100) : 0

  return (
    <div className="page">
      <div className="card result-card">
        <h1>Processing Complete</h1>

        <div className="stats">
          <div className="stat">
            <span className="stat-value">{totalRows}</span>
            <span className="stat-label">Total Rows</span>
          </div>
          <div className="stat stat-valid">
            <span className="stat-value">{validRows}</span>
            <span className="stat-label">Valid ({validPercent}%)</span>
          </div>
          <div className="stat stat-invalid">
            <span className="stat-value">{invalidRows}</span>
            <span className="stat-label">Invalid ({invalidPercent}%)</span>
          </div>
        </div>

        {detectedFields.length > 0 && (
          <div className="fields-section">
            <h3>Detected Fields</h3>
            <div className="field-tags">
              {detectedFields.map((field) => (
                <span key={field} className="tag">{field}</span>
              ))}
            </div>
          </div>
        )}

        <div className="downloads">
          <h3>Download Results</h3>
          <div className="download-buttons">
            {cleanedFiles.map((file) => (
              <a
                key={file}
                href={`/output/${file}`}
                className="btn btn-success"
                download
              >
                {cleanedFiles.length > 1 ? file : 'Cleaned CSV'}
              </a>
            ))}
            <a
              href={`/output/${errorFile}`}
              className="btn btn-warning"
              download
            >
              Validation Errors
            </a>
          </div>
        </div>

        <button onClick={onReset} className="btn btn-secondary">
          Upload Another File
        </button>
      </div>
    </div>
  )
}
