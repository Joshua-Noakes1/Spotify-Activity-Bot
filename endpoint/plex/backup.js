case ('track'):
            // upload image 
            client.post('media/upload', {
                media: poster
            }, function (error, media, response) {
                if (error) {
                    console.log(error);
                    res.status(500).json({
                        "message": error.message
                    });
                    return
                }
                // craft and send tweet
                var status = {
                    status: `Joshua played ${req.body.media.playback.episode} by ${req.body.media.playback.name} on ${req.body.media.time}`,
                    media_ids: media.media_id_string // Pass the media id string
                }

                client.post('statuses/update', status, function (error, tweet, response) {
                    if (error) {
                        console.log(error);
                        res.status(500).json({
                            "message": error.message
                        });
                        return
                    }

                    // success message
                    res.status(200).json({
                        "message": "Successfuly Posted Tweet"
                    });
                    return;
                });


            });
            break;