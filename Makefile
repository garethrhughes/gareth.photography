BUCKET ?= photos.gareth.photography
CLOUDFRONT_ID ?=
ALBUM ?=

.PHONY: install build deploy upload upload-album invalidate

install:
	npm install

build:
	npm run build

# Deploy the site to S3 (optional alternative to GitHub Pages)
deploy: build
	aws s3 sync out/ s3://$(BUCKET)-site/ --delete
ifdef CLOUDFRONT_ID
	$(MAKE) invalidate
endif

# Upload all photos for a specific album to S3
# Usage: make upload ALBUM=noosa
upload-album:
ifndef ALBUM
	$(error ALBUM is required. Usage: make upload-album ALBUM=noosa)
endif
	aws s3 sync photos/$(ALBUM)/ s3://$(BUCKET)/$(ALBUM)/ \
		--exclude ".*" \
		--cache-control "public, max-age=31536000, immutable"
	@echo "Uploaded $(ALBUM) to s3://$(BUCKET)/$(ALBUM)/"

# Upload all local photo albums to S3
upload:
	aws s3 sync photos/ s3://$(BUCKET)/ \
		--exclude ".*" \
		--cache-control "public, max-age=31536000, immutable"

invalidate:
	aws cloudfront create-invalidation --distribution-id $(CLOUDFRONT_ID) --paths "/*"
