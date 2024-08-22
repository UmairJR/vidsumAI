import React from 'react'

const Collapse = ({ transcription, summary, audioSrc, data }) => {
    return (
        <div className="bg-base-200 collapse collapse-arrow w-11/12 m-5">
            <input type="checkbox" className="peer" />
            <div
                className="collapse-title bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
                {transcription && <p>Transcription</p>}{data && <p>Summary</p>}{audioSrc && <p>Audio File (Downloadable)</p>}
            </div>
            <div
                className="collapse-content bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
                <p>{transcription}</p>{data && <div style={{ padding: '20px', lineHeight: '1.6' }}>
                    <p><strong>Original Language:</strong> {data.original_language}</p>
                    <p><strong>Converted to:</strong> {data.converted_to}</p>

                    <h3><strong>Context:</strong></h3>
                    <p>{data.context}</p>

                    <h3><strong>Summary:</strong></h3>
                    <p>{data.summary}</p>
                </div>}
                {audioSrc && <audio controls>
                    <source src={audioSrc} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>}
            </div>
        </div>
    )
}

export default Collapse