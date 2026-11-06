CREATE TABLE "SharedLinkPassphraseAttempt" (
    "shared_link_id" INTEGER NOT NULL,
    "ip_hash" TEXT NOT NULL,
    "failed_attempts" INTEGER NOT NULL DEFAULT 0,
    "in_flight_attempts" INTEGER NOT NULL DEFAULT 0,
    "window_started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SharedLinkPassphraseAttempt_pkey" PRIMARY KEY ("shared_link_id", "ip_hash")
);

CREATE INDEX "SharedLinkPassphraseAttempt_window_started_at_idx"
ON "SharedLinkPassphraseAttempt"("window_started_at");

ALTER TABLE "SharedLinkPassphraseAttempt"
ADD CONSTRAINT "SharedLinkPassphraseAttempt_shared_link_id_fkey"
FOREIGN KEY ("shared_link_id") REFERENCES "SharedLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;
