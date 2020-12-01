$(document).ready(() => {
  $("body").prepend(`
  <nav class="navbar navbar-expand-lg navbar-light" style="background-color: #FF737D;">
    <a class="navbar-brand" href="/">DegreeZ</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item" id="catalog_nav">
          <a class="nav-link" href="catalog">Catalog</a>
        </li>
        <li class="nav-item" id="transcript_nav">
          <a class="nav-link" href="transcript">Transcript</a>
        </li>
        <li class="nav-item" id="planner_nav">
            <a class="nav-link" href="planner">Planner</a>
        </li>
      </ul>
    </div>
  </nav>
  `)
})