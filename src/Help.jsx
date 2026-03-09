import React from "react";

function VideoHelpSection() {
  const mediaItems = [
    {
      src: "/images/prices.jpeg",
      type: "image",
      title: "Price List",
      about: "Detailed print & binding prices",
    },
  ];

  return (
    <div className="help-page-root">
      <style>{`
        html, body, #root {
          margin: 0;
          padding: 0;
          width: 100%;
          background: #ffffff;
          overflow-x: hidden;
        }

        .help-page-root {
          width: 100vw;
          min-height: 100vh;
          background: #ffffff;
          margin: 0;
          padding: 20px 0 40px;
          overflow-x: hidden;
        }

        .help-media-section-list {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 40px;
          background: #ffffff;
        }

        .help-media-block {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: #ffffff;
        }

        /* IMAGE */
        .help-image {
          display: block;
          width: min(420px, 94vw);
          height: auto;
          max-height: none;
          border-radius: 14px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.08);
          background: #ffffff;
          object-fit: contain;
        }

        /* VIDEO */
        .help-video {
          display: block;
          width: min(420px, 94vw);
          height: auto;
          max-height: 85vh;
          aspect-ratio: 9 / 16;
          border-radius: 14px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.08);
          background: #ffffff;
          object-fit: contain;
        }

        .help-media-about {
          margin-top: 12px;
          width: min(420px, 94vw);
          font-size: 15px;
          color: #333;
          text-align: center;
          line-height: 1.6;
          padding: 0 10px;
        }

        .help-media-about strong {
          display: block;
          font-size: 17px;
          margin-bottom: 6px;
          color: #1f2937;
        }

        @media (max-width: 600px) {
          .help-page-root {
            padding: 14px 0 28px;
          }

          .help-media-section-list {
            gap: 28px;
          }

          .help-image,
          .help-video,
          .help-media-about {
            width: 94vw;
          }

          .help-media-about {
            font-size: 14px;
          }

          .help-media-about strong {
            font-size: 16px;
          }
        }
      `}</style>

      <section className="help-media-section-list">
        {mediaItems.map((item, idx) => (
          <div className="help-media-block" key={idx}>
            {item.type === "video" ? (
              <video className="help-video" controls preload="metadata">
                <source src={item.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={item.src}
                alt={item.title}
                className="help-image"
                loading="lazy"
              />
            )}

            <div className="help-media-about">
              <strong>{item.title}</strong>
              <div>{item.about}</div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default VideoHelpSection;
